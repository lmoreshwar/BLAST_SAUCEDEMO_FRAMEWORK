import { type Locator, type Page } from '@playwright/test';

/** SauceDemo login screen — locators only. */
export class LoginPage {
  constructor(private readonly page: Page) {}

  usernameInput = (): Locator => this.page.getByTestId('username');
  passwordInput = (): Locator => this.page.getByTestId('password');
  loginButton = (): Locator => this.page.getByTestId('login-button');
}
