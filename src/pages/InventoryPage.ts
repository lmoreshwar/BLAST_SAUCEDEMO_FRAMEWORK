import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  productSortContainer = (): Locator => this.page.locator('[data-test="product-sort-container"]');
  productsHeading = (): Locator => this.page.getByText('Products', { exact: true });
  productNames = (): Locator => this.page.locator('[data-test="inventory-item-name"]');
  productPrices = (): Locator => this.page.locator('[data-test="inventory-item-price"]');
}
