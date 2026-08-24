import { type Locator, type Page } from '@playwright/test';

export class AddToCartPage {
  constructor(private readonly page: Page) {}

  backpackAddToCartButton = (): Locator => this.page.getByText('$29.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
}
