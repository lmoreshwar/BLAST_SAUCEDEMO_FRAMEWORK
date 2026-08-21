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

  async login(): Promise<void> {
    this.logger.step(1, 'Log in to SauceDemo');
    await this.actions.navigate(urlFor(routes.login), {
      readyElement: this.sauceDemoPage.username(),
    });
    await this.actions.fill(this.sauceDemoPage.username(), credentials('app').username);
    await this.actions.fill(this.sauceDemoPage.password(), credentials('app').password);
    await this.actions.click(this.sauceDemoPage.loginButton());
  }

  async goto(): Promise<void> {
    this.logger.step(2, 'Open the SauceDemo inventory page');
    await this.actions.navigate(urlFor(routes.inventory), {
      readyElement: this.sauceDemoPage.productSortContainer(),
    });
  }

  async selectPriceLowToHigh(): Promise<void> {
    this.logger.step(3, 'Select price low to high sorting');
    await this.actions.selectOption(this.sauceDemoPage.productSortContainer(), 'lohi');
  }

  async selectPriceHighToLow(): Promise<void> {
    this.logger.step(3, 'Select price high to low sorting');
    await this.actions.selectOption(this.sauceDemoPage.productSortContainer(), 'hilo');
  }
}
