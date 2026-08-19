import { type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  constructor(private readonly page: Page) {}

  openMenuButton = (): Locator => this.page.getByRole('button', { name: 'Open Menu' });
  twitterLink = (): Locator => this.page.getByRole('link', { name: 'Twitter' });
  facebookLink = (): Locator => this.page.getByRole('link', { name: 'Facebook' });
  linkedInLink = (): Locator => this.page.getByRole('link', { name: 'LinkedIn' });
}
