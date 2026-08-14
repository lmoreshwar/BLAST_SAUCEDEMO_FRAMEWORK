import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard', exact: true });
    }
}
