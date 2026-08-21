import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    constructor(private readonly page: Page) {}

    username = (): Locator => this.page.locator('[data-test="username"]');

    password = (): Locator => this.page.locator('[data-test="password"]');

    loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
}
