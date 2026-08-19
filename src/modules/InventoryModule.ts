import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { InventoryPage } from '../pages/InventoryPage';

export class InventoryModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('InventoryModule');
  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.inventoryPage = new InventoryPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the inventory page');
    await this.actions.navigate(urlFor(routes.inventory), { readyElement: this.inventoryPage.backpackAddToCartButton() });
  }

  async addBackpackToCart(): Promise<void> {
    this.logger.step(2, 'Add the backpack to the cart');
    await this.actions.click(this.inventoryPage.backpackAddToCartButton());
  }

  async addBikeLightToCart(): Promise<void> {
    this.logger.step(2, 'Add the bike light to the cart');
    await this.actions.click(this.inventoryPage.bikeLightAddToCartButton());
  }

  async addBoltTShirtToCart(): Promise<void> {
    this.logger.step(2, 'Add the bolt t-shirt to the cart');
    await this.actions.click(this.inventoryPage.boltTShirtAddToCartButton());
  }

  async removeBackpackFromCart(): Promise<void> {
    this.logger.step(3, 'Remove the backpack from the cart');
    await this.actions.click(this.inventoryPage.backpackRemoveButton());
  }
}
