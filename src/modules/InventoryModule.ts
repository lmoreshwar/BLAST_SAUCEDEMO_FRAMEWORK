import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { InventoryPage } from '../pages/InventoryPage';

export class InventoryModule {
    private readonly actions: Actions;
    private readonly inventoryPage: InventoryPage;
    private readonly logger = Logger.create('InventoryModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.inventoryPage = new InventoryPage(page);
    }

    async selectSortOption(optionLabel: string): Promise<void> {
        this.logger.info(`Select product sorting option: ${optionLabel}`);
        await this.actions.selectOption(this.inventoryPage.sortControl(), { label: optionLabel });
    }
}
