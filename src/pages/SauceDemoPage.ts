import { type Locator, type Page } from '@playwright/test';

export class SauceDemoPage {
  constructor(private readonly page: Page) {}

  username = (): Locator => this.page.locator('[data-test="username"]');
  password = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
  productSortContainer = (): Locator => this.page.locator('[data-test="product-sort-container"]');
  productPrices = (): Locator => this.page.locator('[data-test="inventory-item-price"]');
}
