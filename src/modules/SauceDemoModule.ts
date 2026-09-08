import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { credentials, routes, urlFor } from '../config';
import { LoginPage } from '../pages/LoginPage';

/** SauceDemo login and inventory workflow. */
export class SauceDemoModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('SauceDemoModule');
  private readonly loginPage: LoginPage;

  constructor(private readonly page: Page) {
    this.actions = new Actions(page);
    this.loginPage = new LoginPage(page);
  }

  /** Open the SauceDemo login screen. */
  async goto(): Promise<void> {
    this.logger.step(1, 'Open the SauceDemo login screen');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.loginPage.usernameInput() });
  }

  /** Submit the supplied credentials. */
  async login(username: string, password: string): Promise<void> {
    this.logger.step(2, 'Submit login credentials');
    await this.actions.fill(this.loginPage.usernameInput(), username);
    await this.actions.fill(this.loginPage.passwordInput(), password);
    await this.actions.click(this.loginPage.loginButton());
  }

  /** Submit the configured valid application credentials. */
  async loginWithValidCredentials(): Promise<void> {
    const { username, password } = credentials('app');
    await this.login(username, password);
  }

  /** Submit invalid credentials. */
  async loginWithInvalidCredentials(): Promise<void> {
    await this.login('invalid_user', 'invalid_password');
  }

  /** Submit the login form without credentials. */
  async submitEmptyLogin(): Promise<void> {
    await this.actions.click(this.loginPage.loginButton());
  }

  /** Submit the login form with only a username. */
  async submitWithUsernameOnly(): Promise<void> {
    await this.actions.fill(this.loginPage.usernameInput(), 'standard_user');
    await this.actions.click(this.loginPage.loginButton());
  }
}
