import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {
        this.loginPage = page.getByRole('button', { name: 'Login' });
    }

  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
  passwordInput = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');

    readonly loginPage: Locator;
}
