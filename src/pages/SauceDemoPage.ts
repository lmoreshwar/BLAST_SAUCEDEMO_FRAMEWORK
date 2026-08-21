import { type Locator, type Page } from '@playwright/test';

export class SauceDemoPage {
  constructor(private readonly page: Page) {}

  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
  passwordInput = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
  productSortContainer = (): Locator => this.page.locator('[data-test="product-sort-container"]');
  backpackImage = (): Locator => this.page.getByRole('img', { name: 'Sauce Labs Backpack' });
  bikeLightImage = (): Locator => this.page.getByRole('img', { name: 'Sauce Labs Bike Light' });
  boltTShirtImage = (): Locator => this.page.getByRole('img', { name: 'Sauce Labs Bolt T-Shirt' });
  fleeceJacketImage = (): Locator => this.page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' });
  onesieImage = (): Locator => this.page.getByRole('img', { name: 'Sauce Labs Onesie' });
  redTShirtImage = (): Locator => this.page.getByRole('img', { name: 'Test.allTheThings() T-Shirt (Red)' });
}
