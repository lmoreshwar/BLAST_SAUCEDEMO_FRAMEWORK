import { type Locator, type Page } from '@playwright/test';

export class ProductCatalogPage {
    readonly sortControl: Locator;
    readonly productNames: Locator;

    constructor(private readonly page: Page) {
        this.sortControl = page.getByRole('combobox');
        this.productNames = page
            .getByRole('link')
            .filter({ has: page.getByRole('img') });
    }
}
