import { type Locator, type Page } from '@playwright/test';

export class PimReportsPage {
    readonly reportNameTextbox: Locator;
    readonly resetButton: Locator;
    readonly searchButton: Locator;
    readonly addButton: Locator;
    readonly recordsFoundText: Locator;
    readonly selectAllCheckbox: Locator;

    constructor(private readonly page: Page) {
        this.reportNameTextbox = page.getByRole('textbox', { name: 'Type for hints...' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.addButton = page.getByRole('button', { name: ' Add' });
        this.recordsFoundText = page.getByText('(4) Records Found', { exact: true });
        this.selectAllCheckbox = page.getByRole('checkbox', { name: '' });
    }
}
