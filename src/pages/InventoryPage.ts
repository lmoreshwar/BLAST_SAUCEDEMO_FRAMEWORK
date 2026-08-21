import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    constructor(private readonly page: Page) {}

    sortControl = (): Locator => this.page.getByRole('combobox');

    productPrices = (): Locator => this.page.getByText(/^\$\d+\.\d{2}$/);
}
