import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  backpackAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  bikeLightAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
  boltTShirtAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  fleeceJacketAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
  onesieAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
  redTShirtAddToCartButton = (): Locator => this.page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  backpackPriceAddToCartButton = (): Locator => this.page.getByText('$29.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  bikeLightPriceAddToCartButton = (): Locator => this.page.getByText('$9.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  boltTShirtPriceAddToCartButton = (): Locator => this.page.getByText('$15.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  fleeceJacketPriceAddToCartButton = (): Locator => this.page.getByText('$49.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  onesiePriceAddToCartButton = (): Locator => this.page.getByText('$7.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
  redTShirtPriceAddToCartButton = (): Locator => this.page.getByText('$15.99', { exact: true }).locator('xpath=ancestor::*[descendant::button or descendant::*[@role="button"]][1]').getByRole('button', { name: 'Add to cart' });
}
