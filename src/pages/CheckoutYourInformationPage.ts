import { type Locator, type Page } from '@playwright/test';

export class CheckoutYourInformationPage {
  constructor(private readonly page: Page) {}

  firstNameInput = (): Locator => this.page.locator('[data-test="firstName"]');
  lastNameInput = (): Locator => this.page.locator('[data-test="lastName"]');
  postalCodeInput = (): Locator => this.page.locator('[data-test="postalCode"]');
  continueButton = (): Locator => this.page.locator('[data-test="continue"]');
  openMenuButton = (): Locator => this.page.getByRole('button', { name: 'Open Menu' });
}
