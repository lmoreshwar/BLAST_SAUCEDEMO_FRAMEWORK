import { type Locator, type Page } from '@playwright/test';

/** SauceDemo cart screen — locators only. */
export class CartPage {
  constructor(private readonly page: Page) {}

  checkoutButton = (): Locator => this.page.getByTestId('checkout');
}
