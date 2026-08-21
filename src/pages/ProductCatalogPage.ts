import { type Locator, type Page } from '@playwright/test';

export class ProductCatalogPage {
    constructor(private readonly page: Page) {}

    catalogTitle = (): Locator => this.page.getByText('Products', { exact: true });

    sortControl = (): Locator => this.page.getByRole('combobox');

    productNames = (): Locator =>
        this.page.locator('.inventory_item').locator('.inventory_item_name');
}
