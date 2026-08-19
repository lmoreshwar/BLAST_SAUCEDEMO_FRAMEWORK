import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { InventoryPage } from '../pages/InventoryPage';

export class InventorySortingModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('InventorySortingModule');
  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.inventoryPage = new InventoryPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the inventory page');
    await this.actions.navigate(urlFor(routes.inventory), {
      readyElement: this.inventoryPage.productsHeading(),
    });
  }

  async sortBy(option: string): Promise<void> {
    this.logger.step(2, `Sort products by ${option}`);
    await this.actions.selectOption(this.inventoryPage.productSortContainer(), option);
  }
}
