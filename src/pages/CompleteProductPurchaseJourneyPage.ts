import { type Locator, type Page } from '@playwright/test';

export class CompleteProductPurchaseJourneyPage {
  constructor(private readonly page: Page) {}

  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
  passwordInput = (): Locator => this.page.locator('[data-test="password"]');
  loginButton = (): Locator => this.page.locator('[data-test="login-button"]');
  backpackAddToCartButton = (): Locator => this.page.getByText('$29.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  checkoutButton = (): Locator => this.page.locator('[data-test="checkout"]');
  firstNameInput = (): Locator => this.page.locator('[data-test="firstName"]');
  lastNameInput = (): Locator => this.page.locator('[data-test="lastName"]');
  postalCodeInput = (): Locator => this.page.locator('[data-test="postalCode"]');
  continueButton = (): Locator => this.page.locator('[data-test="continue"]');
  openMenuButton = (): Locator => this.page.getByRole('button', { name: 'Open Menu' });
  firstNameField = (): Locator => this.page.getByRole('textbox', { name: 'First Name' });
  lastNameField = (): Locator => this.page.getByRole('textbox', { name: 'Last Name' });
  postalCodeField = (): Locator => this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
  twitterLink = (): Locator => this.page.getByRole('link', { name: 'Twitter' });
  facebookLink = (): Locator => this.page.getByRole('link', { name: 'Facebook' });
  linkedInLink = (): Locator => this.page.getByRole('link', { name: 'LinkedIn' });
}
