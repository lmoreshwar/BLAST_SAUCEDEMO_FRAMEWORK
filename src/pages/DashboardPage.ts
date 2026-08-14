import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard', exact: true });
    
    this.profileMenu = page.getByRole('img', { name: 'profile picture' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  
    this.profileDropdown = page.getByRole('img', { name: 'profile picture' });
  }

    readonly profileMenu: Locator;

    readonly logoutLink: Locator;

    readonly profileDropdown: Locator;
}
