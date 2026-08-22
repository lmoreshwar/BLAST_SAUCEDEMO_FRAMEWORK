import { type Locator, type Page } from '@playwright/test';

export class SauceDemoPage {
  constructor(private readonly page: Page) {}

  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
  passwordInput = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
}
