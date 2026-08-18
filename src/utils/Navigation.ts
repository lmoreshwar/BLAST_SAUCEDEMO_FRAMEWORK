import type { Page } from '@playwright/test';
import { config } from '../config';

/**
 * Centralized resilient navigation for the WHOLE framework — login, every existing spec, and every
 * generated feature alike.
 *
 * WHY: Playwright's `page.goto(url)` defaults to `waitUntil: 'load'`, which blocks until the full
 * `load` event — every image, font, analytics/third-party request and lazy resource. On a slow SPA
 * (React/Angular/OrangeHRM) `load` is delayed past the navigation timeout, so `page.goto` times out
 * even though the DOM (and the page's own ready element) was interactable seconds earlier.
 *
 * WHAT: navigate with `waitUntil: 'domcontentloaded'` under a bounded navigation timeout, retry ONLY
 * transient navigation failures a small bounded number of times, then run an OPTIONAL page-specific
 * readiness gate under a SEPARATE readiness timeout. If DOMContentLoaded succeeds but the readiness
 * element never appears, fail with a clear readiness error INSTEAD of blindly re-navigating.
 *
 * App-agnostic: the readiness element is always supplied by the caller — nothing app-specific lives
 * here. `installResilientNavigation()` makes raw `page.goto()` calls resilient too, so generated
 * modules keep using `urlFor(routes.X)` unchanged and still benefit.
 */

export type NavigationWaitUntil = 'domcontentloaded' | 'load' | 'commit' | 'networkidle';

/** Minimal page surface the navigator needs — a real Playwright Page satisfies it; tests inject a fake. */
export interface NavigablePage {
    goto(url: string, options?: { waitUntil?: NavigationWaitUntil; timeout?: number }): Promise<unknown>;
    url(): string;
}

/** A bounded, page-specific readiness gate (e.g. the login username textbox becoming visible). */
export interface ReadinessCheck {
    name: string;
    wait(timeoutMs: number): Promise<void>;
}

export interface NavigateOptions {
    navigationTimeoutMs?: number;
    readinessTimeoutMs?: number;
    retries?: number;
    waitUntil?: NavigationWaitUntil;
    readiness?: ReadinessCheck;
    log?: (line: string) => void;
    retryDelayMs?: number;
    sleep?: (ms: number) => Promise<void>;
}

export interface NavigationResult {
    url: string;
    attempts: number;
    domContentLoaded: boolean;
    ready: boolean;
    response: unknown;
}

const errMsg = (error: unknown): string => (error instanceof Error ? error.message : String(error ?? ''));

// Navigation failures that are transient (worth a small, bounded retry) rather than a permanent error.
const TRANSIENT_NAV_RE =
    /timeout|net::err_|ns_error|econnreset|econnrefused|socket hang up|connection (?:reset|closed|refused)|navigation (?:interrupted|failed because)|interrupted by another navigation|frame was detached|target (?:page|frame|context)?\s*closed|page crashed|websocket/i;

/** True when a navigation error looks transient (timeout / connection reset / interruption). */
export function isTransientNavError(error: unknown): boolean {
    return TRANSIENT_NAV_RE.test(errMsg(error));
}

/** Reached DOMContentLoaded, but the page-specific readiness element never appeared. */
export class NavigationReadinessError extends Error {
    constructor(
        readonly url: string,
        readonly readinessName: string,
        readonly timeoutMs: number,
        readonly currentUrl: string,
        readonly cause?: unknown,
    ) {
        super(
            `[Navigation] readiness FAILED: "${readinessName}" not visible within ${timeoutMs}ms after DOMContentLoaded ` +
                `(url: ${url}, current: ${currentUrl}) — ${errMsg(cause)}`,
        );
        this.name = 'NavigationReadinessError';
    }
}

/** DOMContentLoaded never succeeded within the bounded retry budget. */
export class NavigationError extends Error {
    constructor(
        readonly url: string,
        readonly attempts: number,
        readonly timeoutMs: number,
        readonly currentUrl: string,
        readonly cause?: unknown,
    ) {
        super(
            `[Navigation] FAILED to reach DOMContentLoaded for ${url} after ${attempts} attempt(s) ` +
                `(per-attempt ${timeoutMs}ms, current: ${currentUrl}) — ${errMsg(cause)}`,
        );
        this.name = 'NavigationError';
    }
}

const defaultSleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const positive = (value: number | undefined, fallback: number): number =>
    typeof value === 'number' && value > 0 ? value : fallback;

// The unpatched Playwright goto is stashed under this symbol by installResilientNavigation, so the
// navigator (and Actions.navigate) always call the RAW goto and never recurse through the patch.
const RAW_GOTO = Symbol.for('blast.navigation.rawGoto');
type RawGoto = (url: string, options?: { waitUntil?: NavigationWaitUntil; timeout?: number }) => Promise<unknown>;

function rawGotoFor(page: NavigablePage): RawGoto {
    const stashed = (page as unknown as Record<symbol, RawGoto | undefined>)[RAW_GOTO];
    return stashed ?? ((url, options) => page.goto(url, options));
}

function currentUrlOf(page: NavigablePage): string {
    try {
        return page.url();
    } catch {
        return '(unknown)';
    }
}

function logFailure(
    log: (line: string) => void,
    info: { url: string; attempt: number; phase: 'navigation' | 'readiness'; timeoutMs: number; currentUrl: string; error: unknown },
): void {
    log('FAILED');
    log(`  URL: ${info.url}`);
    log(`  attempt: ${info.attempt}`);
    log(`  phase: ${info.phase}`);
    log(`  timeout: ${info.timeoutMs}ms`);
    log(`  current URL: ${info.currentUrl}`);
    log(`  error: ${errMsg(info.error)}`);
}

/**
 * Navigate to `url` resiliently: bounded retry to DOMContentLoaded, then an optional page-specific
 * readiness gate. Throws {@link NavigationError} if navigation never lands and
 * {@link NavigationReadinessError} if it lands but the readiness element never appears.
 */
export async function resilientNavigate(page: NavigablePage, url: string, options: NavigateOptions = {}): Promise<NavigationResult> {
    const navigationTimeoutMs = positive(options.navigationTimeoutMs, config.navigationTimeout);
    const readinessTimeoutMs = positive(options.readinessTimeoutMs, config.readinessTimeout);
    const retries = Math.max(0, options.retries ?? config.retryCount);
    const waitUntil = options.waitUntil ?? 'domcontentloaded';
    const log = options.log ?? ((): void => undefined);
    const sleep = options.sleep ?? defaultSleep;
    const retryDelayMs = positive(options.retryDelayMs, 1000);
    const goto = rawGotoFor(page);
    const maxAttempts = retries + 1;

    let attempts = 0;
    let response: unknown;
    let navigated = false;
    let lastError: unknown;
    for (let i = 0; i < maxAttempts; i += 1) {
        attempts = i + 1;
        log(`Opening ${url}${attempts > 1 ? ` (attempt ${attempts}/${maxAttempts})` : ''}`);
        try {
            response = await goto(url, { waitUntil, timeout: navigationTimeoutMs });
            log('DOMContentLoaded ✓');
            navigated = true;
            break;
        } catch (error) {
            lastError = error;
            logFailure(log, { url, attempt: attempts, phase: 'navigation', timeoutMs: navigationTimeoutMs, currentUrl: currentUrlOf(page), error });
            // Only retry transient failures, and only while budget remains — never loop indefinitely.
            if (!isTransientNavError(error) || attempts >= maxAttempts) {
                throw new NavigationError(url, attempts, navigationTimeoutMs, currentUrlOf(page), error);
            }
            await sleep(retryDelayMs);
        }
    }
    if (!navigated) throw new NavigationError(url, attempts, navigationTimeoutMs, currentUrlOf(page), lastError);

    if (options.readiness) {
        log('Waiting for application readiness...');
        try {
            await options.readiness.wait(readinessTimeoutMs);
            log('Application readiness ✓');
        } catch (error) {
            // DOMContentLoaded already succeeded — a missing readiness element is NOT a navigation
            // problem, so report it clearly instead of re-driving the whole browser navigation.
            logFailure(log, { url, attempt: attempts, phase: 'readiness', timeoutMs: readinessTimeoutMs, currentUrl: currentUrlOf(page), error });
            throw new NavigationReadinessError(url, options.readiness.name, readinessTimeoutMs, currentUrlOf(page), error);
        }
    }

    log('Navigation completed ✓');
    return { url, attempts, domContentLoaded: true, ready: Boolean(options.readiness), response };
}

/**
 * Make EVERY `page.goto()` on this page resilient (waitUntil:'domcontentloaded' + bounded retry +
 * diagnostics) without touching any Page Object, Module, or codegen — so existing specs and generated
 * features that call `page.goto(urlFor(routes.X))` directly benefit automatically. Idempotent per page;
 * the module's own post-goto `waitForVisible(...)` remains its feature-specific readiness gate.
 */
export function installResilientNavigation(page: Page, options?: { log?: (line: string) => void }): void {
    const holder = page as unknown as Record<symbol, RawGoto | undefined>;
    if (holder[RAW_GOTO]) return;
    holder[RAW_GOTO] = page.goto.bind(page) as RawGoto;
    const log = options?.log;
    page.goto = (async (url: string, opts?: { waitUntil?: NavigationWaitUntil; timeout?: number }) => {
        const result = await resilientNavigate(page, url, {
            navigationTimeoutMs: opts?.timeout,
            waitUntil: opts?.waitUntil,
            log,
        });
        return (result.response as Awaited<ReturnType<Page['goto']>>) ?? null;
    }) as unknown as Page['goto'];
}
