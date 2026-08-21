import { expect, test } from '../fixtures';
import { credentials } from '../config';

test.describe('Product Catalog sorting', () => {
    test.beforeEach(async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(credentials('app').username, credentials('app').password);
        await expect(page).toHaveURL(/\/inventory\.html$/);
    });

    

    test('TC_002 @ProductCatalog @Sorting @Validation @Regression Verify Name Z-A sorting option and ordering', async ({
        productCatalogModule,
    }) => {
        await productCatalogModule.selectSortOption('Name (Z to A)');

        const displayedNames = await productCatalogModule.displayedProductNames();
        const expectedNames = [...displayedNames].sort((left, right) => right.localeCompare(left));

        expect(displayedNames).toEqual(expectedNames);
    });
});
