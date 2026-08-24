import { type Locator, type Page } from '@playwright/test';

/** SauceDemo inventory (products) screen — locators only. */
export class InventoryPage {
  constructor(private readonly page: Page) {}

  /**
   * Add-to-cart button for a product, keyed by its SauceDemo item id
   * (e.g. 'sauce-labs-backpack'). Parameterised so one locator serves every product row.
   */
  addToCartButton = (itemId: string): Locator => this.page.getByTestId(`add-to-cart-${itemId}`);
}
