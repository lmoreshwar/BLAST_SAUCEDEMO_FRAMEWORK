import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { credentials, type Credentials, routes, urlFor } from '../config';
import { LoginPage } from '../pages/LoginPage';

export class LoginModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('LoginModule');
  private readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.loginPage = new LoginPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.loginPage.usernameInput() });
  }

  async login(loginCredentials?: Credentials): Promise<void> {
    const { username, password } = loginCredentials ?? credentials('app');
    this.logger.step(2, 'Submit valid credentials');
    await this.actions.fill(this.loginPage.usernameInput(), username);
    await this.actions.fill(this.loginPage.passwordInput(), password);
    await this.actions.click(this.loginPage.loginButton());
  }
}
