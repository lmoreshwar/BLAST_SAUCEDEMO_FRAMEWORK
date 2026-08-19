import { test, expect } from '@playwright/test';
import {
    resilientNavigate,
    isTransientNavError,
    NavigationError,
    NavigationReadinessError,
    type NavigablePage,
    type NavigateOptions,
} from '../utils/Navigation';
import { config, routes, urlFor, urlRegex } from '../config';

/**
 * Unit tests for the centralized resilient navigator. These are PURE-logic tests — they inject a fake
 * page and never touch `{ page }`, so no browser is launched. They run once (desktop-chrome) to avoid
 * identical repeats across every configured project.
 */
test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Navigation unit tests run once on desktop-chrome');
});

interface GotoCall {
    url: string;
    options?: { waitUntil?: string; timeout?: number };
}

/** A fake page recording every goto() call; `gotoImpl` decides how each attempt resolves/rejects. */
function fakePage(
    gotoImpl: (call: GotoCall, attempt: number) => Promise<unknown>,
    currentUrl = 'about:blank',
): NavigablePage & { calls: GotoCall[] } {
    const calls: GotoCall[] = [];
    return {
        calls,
        url: () => currentUrl,
        goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<unknown> {
            const call: GotoCall = { url, options };
            calls.push(call);
            return gotoImpl(call, calls.length);
        },
    } as NavigablePage & { calls: GotoCall[] };
}

// Deterministic defaults: no real sleeping, no log noise.
const silent: NavigateOptions = { log: () => undefined, sleep: async () => undefined, retryDelayMs: 0 };

test('1: successful DOMContentLoaded navigation resolves on the first attempt', async () => {
    const page = fakePage(async () => null);
    const logs: string[] = [];
    const result = await resilientNavigate(page, 'https://app/login', {
        ...silent,
        log: (l) => logs.push(l),
        navigationTimeoutMs: 5000,
    });
    expect(result.domContentLoaded).toBe(true);
    expect(result.attempts).toBe(1);
    expect(page.calls).toHaveLength(1);
    expect(page.calls[0].options).toEqual({ waitUntil: 'domcontentloaded', timeout: 5000 });
    expect(logs.join('\n')).toContain('DOMContentLoaded ✓');
    expect(logs.join('\n')).toContain('Navigation completed ✓');
});

test('2: a delayed load event never blocks — navigation uses domcontentloaded', async () => {
    // Rejects if anyone asks for the full 'load' event; resolves for 'domcontentloaded'.
    const page = fakePage(async (call) => {
        if (call.options?.waitUntil === 'load') throw new Error('Timeout 90000ms exceeded waiting until "load"');
        return null;
    });
    const result = await resilientNavigate(page, 'https://spa/app', { ...silent });
    expect(result.domContentLoaded).toBe(true);
    expect(page.calls[0].options?.waitUntil).toBe('domcontentloaded');
});

test('3: a transient navigation failure is retried and then succeeds', async () => {
    const page = fakePage(async (_call, attempt) => {
        if (attempt === 1) throw new Error('net::ERR_CONNECTION_RESET at https://app');
        return null;
    });
    const sleeps: number[] = [];
    const result = await resilientNavigate(page, 'https://app', {
        ...silent,
        sleep: async (ms) => {
            sleeps.push(ms);
        },
        retryDelayMs: 10,
        retries: 2,
    });
    expect(result.attempts).toBe(2);
    expect(page.calls).toHaveLength(2);
    expect(sleeps).toHaveLength(1);
});

test('4: navigation gives up with NavigationError once the retry limit is reached', async () => {
    const page = fakePage(async () => {
        throw new Error('Timeout 90000ms exceeded');
    });
    let err: unknown;
    try {
        await resilientNavigate(page, 'https://app', { ...silent, retries: 2 });
    } catch (e) {
        err = e;
    }
    expect(err).toBeInstanceOf(NavigationError);
    expect((err as NavigationError).attempts).toBe(3);
    expect(page.calls).toHaveLength(3);
});

test('5: a readiness-element timeout is reported WITHOUT re-navigating the browser', async () => {
    const page = fakePage(async () => null);
    const readiness = {
        name: 'login username textbox',
        wait: async () => {
            throw new Error('Timeout 15000ms exceeded waiting for locator');
        },
    };
    const logs: string[] = [];
    let err: unknown;
    try {
        await resilientNavigate(page, 'https://app/login', { ...silent, log: (l) => logs.push(l), retries: 2, readiness });
    } catch (e) {
        err = e;
    }
    expect(err).toBeInstanceOf(NavigationReadinessError);
    expect((err as NavigationReadinessError).readinessName).toBe('login username textbox');
    expect(page.calls).toHaveLength(1); // navigation succeeded once and is NOT retried for a readiness miss
    expect(logs.join('\n')).toContain('phase: readiness');
});

test('6: never retries beyond the bounded budget (no infinite retry)', async () => {
    const page = fakePage(async () => {
        throw new Error('net::ERR_CONNECTION_RESET');
    });
    let err: unknown;
    try {
        await resilientNavigate(page, 'https://app', { ...silent, retries: 5 });
    } catch (e) {
        err = e;
    }
    expect(err).toBeInstanceOf(NavigationError);
    expect(page.calls).toHaveLength(6); // retries(5) + 1 initial attempt, never more
});

test('7: navigates with the exact urlFor(routes.X) string (navigation URL contract preserved)', async () => {
    const page = fakePage(async () => null);
    const target = urlFor(routes.login);
    expect(target).toBe(`${config.baseUrl}/`);
    await resilientNavigate(page, target, { ...silent });
    expect(page.calls[0].url).toBe(target);
    expect(typeof page.calls[0].url).toBe('string');
    // urlFor is idempotent on an already-absolute URL.
    expect(urlFor('https://host.example/inventory.html')).toBe('https://host.example/inventory.html');
});

test('8: urlRegex(routes.X) is a RegExp for assertions only, never a navigation target', async () => {
    const rx = urlRegex(routes.inventory);
    expect(rx).toBeInstanceOf(RegExp);
    const inventoryUrl = `${config.baseUrl}/inventory.html`;
    expect(rx.test(inventoryUrl)).toBe(true);
    // The navigator only ever receives a plain string URL built by urlFor — never a RegExp.
    const page = fakePage(async () => null);
    await resilientNavigate(page, urlFor(routes.inventory), { ...silent });
    expect(typeof page.calls[0].url).toBe('string');
    expect(page.calls[0].url).toBe(urlFor(routes.inventory));
});

test('isTransientNavError flags timeouts/resets/interruptions but not app errors', () => {
    expect(isTransientNavError(new Error('Timeout 90000ms exceeded'))).toBe(true);
    expect(isTransientNavError(new Error('net::ERR_CONNECTION_RESET'))).toBe(true);
    expect(isTransientNavError(new Error('navigation interrupted by another one'))).toBe(true);
    expect(isTransientNavError(new Error('strict mode violation: locator resolved to 2 elements'))).toBe(false);
});
