import * as dotenv from 'dotenv';
import * as path from 'path';

// ─── Load environment files ───────────────────────────────────────────────────
const testEnv = process.env.TEST_ENV || 'qa';
const envFile = testEnv === 'production' ? '.env' : `.env.${testEnv}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config(); // fallback to root .env

// Normalise BASE_URL: strip trailing slash(es) so `${env('BASE_URL')}/path`
// never produces a double slash (`//`) regardless of how the value/secret is set.
if (process.env.BASE_URL) {
    process.env.BASE_URL = process.env.BASE_URL.replace(/\/+$/, '');
}

// ─── Framework Config (rarely changes) ───────────────────────────────────────
export interface AppConfig {
    baseUrl: string;
    defaultTimeout: number;
    navigationTimeout: number;
    logLevel: string;
    retryCount: number;
    testEnv: string;
}

export const config: AppConfig = {
    baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '90000', 10),
    logLevel: process.env.LOG_LEVEL || 'INFO',
    retryCount: parseInt(process.env.RETRY_COUNT || '2', 10),
    testEnv,
};

// ─── env() Helper — Read ANY key from .env (no index.ts changes needed) ──────
/**
 * Read any environment variable from your .env file.
 * Just add the key to .env and call env('KEY_NAME') anywhere in code.
 *
 * @example
 *   env('APP_USERNAME')       → 'standard_user'
 *   env('BASE_URL')           → 'https://www.saucedemo.com'
 *   env('SAUCE_USERNAME')     → your Sauce Labs user
 *   env('MY_NEW_API_TOKEN')   → reads from .env — no index.ts update needed!
 *
 * @param key - The environment variable name (exactly as in .env)
 * @param fallback - Optional default value if key is missing
 */
export function env(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}

// ─── credentials() — Read login secrets from .env ONLY (never JSON/source) ────
export interface Credentials {
    username: string;
    password: string;
}

/**
 * Read login credentials from environment variables ONLY. Credentials must NEVER live in
 * JSON test data or source — they belong in the gitignored `.env.<env>` file and are read
 * from there at runtime.
 *
 * Profiles map to .env keys:
 *   'app' → APP_USERNAME / APP_PASSWORD
 *
 * Throws a clear setup error when a key is missing, instead of logging in with blanks.
 */
export function credentials(profile: 'app' = 'app'): Credentials {
    const username = env('APP_USERNAME');
    const password = env('APP_PASSWORD');
    if (!username || !password) {
        throw new Error(
            `Missing ${profile} credentials. Set APP_USERNAME and APP_PASSWORD in your .env.${testEnv} file.`,
        );
    }
    return { username, password };
}

// ─── routes — the ONE place app paths live (never hardcode a URL/path elsewhere) ──────────────
/**
 * Application route PATHS (relative to `config.baseUrl`). Every Page/Module `goto()` and every
 * spec URL assertion MUST reference a key here via `urlFor()` / `urlRegex()` — never a raw string
 * literal. Add a new key here when automating a new screen; reuse an existing one otherwise.
 */
export const routes = {
    login: '/web/index.php/auth/login',
    dashboard: '/web/index.php/dashboard/index',
    adminAddUser: '/web/index.php/admin/saveSystemUser',
    adminUserManagement: '/web/index.php/admin/viewSystemUsers',
    pimAddEmployee: '/web/index.php/pim/addEmployee',
    pimViewPersonalDetails: '/web/index.php/pim/viewPersonalDetails/empNumber/',
    recruitmentAddCandidate: '/web/index.php/recruitment/addCandidate',
    recruitmentCandidateDetails: '/web/index.php/recruitment/addCandidate',
    adminJobTitles: '/web/index.php/admin/viewJobTitleList',
    adminSaveJobTitle: '/web/index.php/admin/saveJobTitle',
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes] | string;

/**
 * Build a full, environment-correct URL from `config.baseUrl` + a relative route path.
 * Use for navigation: `await page.goto(urlFor(routes.login))`. Idempotent if an absolute URL
 * is passed. Never concatenate base URLs by hand.
 */
export function urlFor(routePath: RoutePath): string {
    if (/^https?:\/\//i.test(routePath)) return routePath;
    const rel = routePath.startsWith('/') ? routePath : `/${routePath}`;
    return `${config.baseUrl}${rel}`;
}

/**
 * Build an environment-agnostic RegExp that matches a route by its PATH, for URL assertions:
 * `await expect(page).toHaveURL(urlRegex(routes.dashboard))`. Matching on path (not host) keeps
 * assertions valid across environments/base URLs.
 */
export function urlRegex(routePath: RoutePath): RegExp {
    const pathOnly = routePath.replace(/^https?:\/\/[^/]+/i, '');
    return new RegExp(pathOnly.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

export default config;
