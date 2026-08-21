import { expect, test } from '../fixtures';
import { credentials } from '../config';

test.describe('Product Catalog sorting', () => {
    test.beforeEach(async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(credentials('app').username, credentials('app').password);
        await expect(page).toHaveURL(/\/inventory\.html$/);
    });

    test('TC_001 @ProductCatalog @Sorting @Validation @Smoke @Regression Verify Name A-Z sorting option and ordering', async ({
        productCatalogModule,
    }) => {
        await productCatalogModule.selectSortOption('Name (A to Z)');

        const displayedNames = await productCatalogModule.displayedProductNames();
        const expectedNames = [...displayedNames].sort((left, right) => left.localeCompare(right));

        expect(displayedNames).toEqual(expectedNames);
    });
});
