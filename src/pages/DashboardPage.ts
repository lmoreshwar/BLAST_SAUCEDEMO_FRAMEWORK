import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard', exact: true });
    
    this.profileMenuToggle = page.getByRole('button', { name: 'Profile Menu' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  
    this.profileMenuButton = page.getByRole('button', { name: 'Profile Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

    readonly profileMenuToggle: Locator;

    readonly logoutMenuItem: Locator;

    readonly profileMenuButton: Locator;

    readonly logoutLink: Locator;
}
