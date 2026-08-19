import { test, expect } from '../fixtures';
import { credentials } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { InventorySortingModule } from '../modules/InventorySortingModule';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Product Sorting', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 sort products by name descending @InventorySorting @Smoke @Regression', async ({ page }) => {
    const inventorySortingModule = new InventorySortingModule(page);
    const inventoryPage = new InventoryPage(page);
    await inventorySortingModule.goto();
    await inventorySortingModule.sortBy('Name (Z to A)');
    await expect(inventoryPage.productSortContainer()).toHaveValue('za');
  });

  test('TC_002 sort products by price ascending @InventorySorting @Regression', async ({ page }) => {
    const inventorySortingModule = new InventorySortingModule(page);
    const inventoryPage = new InventoryPage(page);
    await inventorySortingModule.goto();
    await inventorySortingModule.sortBy('Price (low to high)');
    await expect(inventoryPage.productSortContainer()).toHaveValue('lohi');
  });

  test('TC_003 sort products by price descending @InventorySorting @Regression', async ({ page }) => {
    const inventorySortingModule = new InventorySortingModule(page);
    const inventoryPage = new InventoryPage(page);
    await inventorySortingModule.goto();
    await inventorySortingModule.sortBy('Price (high to low)');
    await expect(inventoryPage.productSortContainer()).toHaveValue('hilo');
  });
});
