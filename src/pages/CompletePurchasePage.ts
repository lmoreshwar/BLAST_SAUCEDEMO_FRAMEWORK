import { type Locator, type Page } from '@playwright/test';

export class CompletePurchasePage {
  constructor(private readonly page: Page) {}

  backpackAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  checkoutButton = (): Locator => this.page.locator('[data-test="checkout"]');
  continueButton = (): Locator => this.page.locator('[data-test="continue"]');
  firstNameInput = (): Locator => this.page.locator('[data-test="firstName"]');
  lastNameInput = (): Locator => this.page.locator('[data-test="lastName"]');
  postalCodeInput = (): Locator => this.page.locator('[data-test="postalCode"]');
}
