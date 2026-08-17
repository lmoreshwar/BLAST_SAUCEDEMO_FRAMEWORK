import { type Locator, type Page } from '@playwright/test';

export class AdminUserManagementPage {
    readonly searchButton: Locator;

    constructor(private readonly page: Page) {
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }
}
