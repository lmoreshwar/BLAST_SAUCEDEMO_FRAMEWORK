import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { credentials, routes, urlFor } from '../config';
import { SauceDemoPage } from '../pages/SauceDemoPage';

export class SauceDemoModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('SauceDemoModule');
  private readonly sauceDemoPage: SauceDemoPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.sauceDemoPage = new SauceDemoPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.sauceDemoPage.usernameInput() });
  }

  async login(): Promise<void> {
    this.logger.step(2, 'Submit valid credentials');
    const { username, password } = credentials('app');
    await this.actions.fill(this.sauceDemoPage.usernameInput(), username);
    await this.actions.fill(this.sauceDemoPage.passwordInput(), password);
    await this.actions.click(this.sauceDemoPage.loginButton());
  }
}
