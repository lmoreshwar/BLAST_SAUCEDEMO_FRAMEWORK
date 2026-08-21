import { test, expect } from '../fixtures';

test.describe('Product Catalog sorting', () => {
    test.beforeEach(async ({ loginModule, productCatalogModule }) => {
        await loginModule.goto();
        await loginModule.login();
        await expect(productCatalogModule.productCatalogPage.catalogTitle()).toBeVisible();
    });

    test(
        'TC_001 @ProductCatalog @Sorting @Smoke @Regression Verify Name A-Z sorting option and ordering',
        async ({ productCatalogModule }) => {
            await productCatalogModule.selectSortOption('Name (A to Z)');

            await expect(productCatalogModule.productCatalogPage.sortControl()).toHaveValue('az');
            await expect(productCatalogModule.productCatalogPage.productNames()).toHaveText([
                'Sauce Labs Backpack',
                'Sauce Labs Bike Light',
                'Sauce Labs Bolt T-Shirt',
                'Sauce Labs Fleece Jacket',
                'Sauce Labs Onesie',
                'Test.allTheThings() T-Shirt (Red)',
            ]);
        },
    );
}); 
