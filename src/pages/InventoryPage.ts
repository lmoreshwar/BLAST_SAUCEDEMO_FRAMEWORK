import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  backpackAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  backpackRemoveButton = (): Locator => this.page.locator('[data-test="remove-sauce-labs-backpack"]');
  bikeLightAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
  boltTShirtAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  productSortContainer = (): Locator => this.page.locator('[data-test="product-sort-container"]');
  productsHeading = (): Locator => this.page.getByText('Products', { exact: true });
  productNames = (): Locator => this.page.locator('[data-test="inventory-item-name"]');
  productPrices = (): Locator => this.page.locator('[data-test="inventory-item-price"]');
}
