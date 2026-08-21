import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';

export class ProductCatalogModule {
    private readonly actions: Actions;
    readonly productCatalogPage: ProductCatalogPage;
    private readonly logger = Logger.create('ProductCatalogModule');

    constructor(page: Page) {
        this.actions = new Actions(page);
        this.productCatalogPage = new ProductCatalogPage(page);
    }

    async selectSortOption(optionLabel: string): Promise<void> {
        this.logger.info(`Select product sorting option: ${optionLabel}`);
        await this.actions.selectOption(this.productCatalogPage.sortControl(), { label: optionLabel });
    }

    async trySelectUnsupportedSortOption(optionLabel: string): Promise<boolean> {
        this.logger.info(`Attempt unsupported product sorting option: ${optionLabel}`);

        try {
            await this.actions.selectOption(this.productCatalogPage.sortControl(), { label: optionLabel });
            return true;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.info(`Unsupported sorting option was rejected: ${error.message}`);
            } else {
                this.logger.info('Unsupported sorting option was rejected.');
            }
            return false;
        }
    }
}
