import { test, expect } from '../fixtures';
import { credentials } from '../config';

test.describe('Product Catalog sorting', () => {
    test.beforeEach(async ({ loginModule, inventoryPage }) => {
        await loginModule.goto();
        await loginModule.login(credentials('app').username, credentials('app').password);
        await expect(inventoryPage.sortControl()).toBeVisible();
    });

    test('TC_003 @ProductCatalog @Smoke @Regression Verify Price Low-High sorting option and ordering', async ({
        inventoryModule,
        inventoryPage,
    }) => {
        await inventoryModule.selectSortOption('Price (low to high)');

        const displayedPrices = await inventoryPage.productPrices().allTextContents();
        const prices = displayedPrices.map((price) => Number.parseFloat(price.replace('$', '')));

        expect(prices.length).toBeGreaterThan(1);
        expect(prices).toEqual([...prices].sort((lowest, highest) => lowest - highest));
    });
});
