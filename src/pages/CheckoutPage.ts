import { type Locator, type Page } from '@playwright/test';

/** SauceDemo checkout information screen — locators only. */
export class CheckoutPage {
  constructor(private readonly page: Page) {}

  firstNameInput = (): Locator => this.page.getByTestId('firstName');
  lastNameInput = (): Locator => this.page.getByTestId('lastName');
  postalCodeInput = (): Locator => this.page.getByTestId('postalCode');
  continueButton = (): Locator => this.page.getByTestId('continue');
}
