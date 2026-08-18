import { type Locator, type Page } from '@playwright/test';
import { TIMEOUTS } from './constants';

export type UniqueValueKind = 'numeric' | 'alphanumeric' | 'email';

export interface UniqueValueOptions {
    kind?: UniqueValueKind;
    length?: number;
}

export interface CollisionRetryOptions {
    page: Page;
    successUrl: string | RegExp;
    collision: Locator;
    makeValue: () => string;
    submit: (value: string) => Promise<void>;
    attempts?: number;
    timeout?: number;
    collisionMessage?: string;
}

const DEFAULT_COLLISION_ATTEMPTS = 3;
const MIN_COLLISION_ATTEMPTS = 1;
const DEFAULT_NUMERIC_LENGTH = 7;
const DEFAULT_TOKEN_LENGTH = 8;
let sequence = 0;

/** Create a per-run value suitable for a field with a server-side uniqueness constraint. */
export function uniqueValue(seed: string, options: UniqueValueOptions = {}): string {
    sequence += 1;
    const kind = options.kind ?? 'alphanumeric';
    const token = `${Date.now()}${sequence}`;
    const length = Math.max(MIN_COLLISION_ATTEMPTS, options.length ?? DEFAULT_TOKEN_LENGTH);

    if (kind === 'numeric') {
        return token.replace(/\D/g, '').slice(-(options.length ?? DEFAULT_NUMERIC_LENGTH));
    }

    if (kind === 'email') {
        const [localPart = 'auto', domain = 'example.test'] = seed.trim().split('@');
        return `${localPart || 'auto'}+${token.slice(-length)}@${domain || 'example.test'}`;
    }

    const prefix = seed.trim().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'auto';
    return `${prefix}-${token.slice(-length)}`;
}

/** Submit unique candidates until the live collision validator is absent or the attempt budget is exhausted. */
export async function retryOnCollision(options: CollisionRetryOptions): Promise<string> {
    const attempts = Math.max(MIN_COLLISION_ATTEMPTS, options.attempts ?? DEFAULT_COLLISION_ATTEMPTS);
    const timeout = options.timeout ?? TIMEOUTS.LONG;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const value = options.makeValue();
        await options.submit(value);

        const outcome = await Promise.race([
            options.page.waitForURL(options.successUrl, { timeout }).then(() => 'success' as const),
            options.collision.waitFor({ state: 'visible', timeout }).then(() => 'collision' as const),
        ]);
        if (outcome === 'success') return value;
    }

    const detail = options.collisionMessage ? `: ${options.collisionMessage}` : '';
    throw new Error(`Unique-value collision persisted after ${attempts} attempts${detail}`);
}