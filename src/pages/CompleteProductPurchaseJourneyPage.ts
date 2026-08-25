import { type Locator, type Page } from '@playwright/test';

/** Purchase journey screen locators for checkout information and completion. */
export class CompleteProductPurchaseJourneyPage {
  constructor(private readonly page: Page) {}

  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
  passwordInput = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
  addToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  openMenuButton = (): Locator => this.page.getByRole('button', { name: 'Open Menu' });
  checkoutButton = (): Locator => this.page.locator('[data-test="checkout"]');
  firstNameInput = (): Locator => this.page.locator('[data-test="firstName"]');
  lastNameInput = (): Locator => this.page.locator('[data-test="lastName"]');
  postalCodeInput = (): Locator => this.page.locator('[data-test="postalCode"]');
  continueButton = (): Locator => this.page.locator('[data-test="continue"]');
}
