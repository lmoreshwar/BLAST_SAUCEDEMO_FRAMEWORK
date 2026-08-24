import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { InventoryPage } from '../pages/InventoryPage';

/** Inventory workflow: browse products and add them to the cart. */
export class InventoryModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('InventoryModule');
  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.actions = new Actions(page);
    this.inventoryPage = new InventoryPage(page);
  }

  /** Open the inventory and add the given product to the cart. */
  async addProductToCart(itemId: string): Promise<void> {
    this.logger.step(1, `Add product to cart: ${itemId}`);
    await this.actions.navigate(urlFor(routes.inventory), {
      readyElement: this.inventoryPage.addToCartButton(itemId),
    });
    await this.actions.click(this.inventoryPage.addToCartButton(itemId));
  }
}
