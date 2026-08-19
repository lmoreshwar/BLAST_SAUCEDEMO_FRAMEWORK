import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';

export class ProductDetailsModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('ProductDetailsModule');

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the Sauce Labs Backpack product details');
    await this.actions.navigate(urlFor(routes.productDetails));
  }
}
