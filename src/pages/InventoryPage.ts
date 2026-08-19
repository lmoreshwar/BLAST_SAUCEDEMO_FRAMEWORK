import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  backpackAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  backpackRemoveButton = (): Locator => this.page.locator('[data-test="remove-sauce-labs-backpack"]');
  backpackPriceAddToCartButton = (): Locator => this.page.getByText('$29.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
}
