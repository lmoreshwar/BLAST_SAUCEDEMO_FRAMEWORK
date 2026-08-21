import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';

export class ProductCatalogModule {
    private readonly actions: Actions;
    private readonly catalogPage: ProductCatalogPage;
    private readonly logger = Logger.create('ProductCatalogModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.catalogPage = new ProductCatalogPage(page);
    }

    async selectSortOption(optionLabel: string): Promise<void> {
        this.logger.info(`Select catalog sort option: ${optionLabel}`);
        await this.actions.selectOption(this.catalogPage.sortControl, { label: optionLabel });
    }

    async displayedProductNames(): Promise<string[]> {
        this.logger.info('Read the displayed product order');
        return this.catalogPage.productNames.allTextContents();
    }
}
