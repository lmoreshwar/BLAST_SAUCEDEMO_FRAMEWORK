import { type Locator, type Page } from '@playwright/test';

export class CompletePurchasePage {
  constructor(private readonly page: Page) {}

  checkoutButton = (): Locator => this.page.locator('[data-test="checkout"]');
  firstNameInput = (): Locator => this.page.getByRole('textbox', { name: 'First Name' });
  lastNameInput = (): Locator => this.page.getByRole('textbox', { name: 'Last Name' });
  postalCodeInput = (): Locator => this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
  continueButton = (): Locator => this.page.locator('[data-test="continue"]');
  backpackAddToCartButton = (): Locator => page.getByText('$29.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
}
