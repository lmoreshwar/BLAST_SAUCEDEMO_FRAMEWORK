import { type Locator, type Page } from '@playwright/test';

export class SideMenuPage {
  constructor(private readonly page: Page) {}

  openMenuButton = (): Locator => this.page.getByRole('button', { name: 'Open Menu' });
  logoutLink = (): Locator => this.page.locator('[data-test="logout-sidebar-link"]');
  usernameInput = (): Locator => this.page.locator('[data-test="username"]');
}
