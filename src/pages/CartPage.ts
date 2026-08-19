import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  backpackPrice = (): Locator => this.page.getByText('$29.99', { exact: true });
}
