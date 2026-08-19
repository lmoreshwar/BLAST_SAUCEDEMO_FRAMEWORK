import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { InventoryModule } from '../modules/InventoryModule';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Remove Product from Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 remove an added backpack from the cart @InventoryRemoveProduct @Smoke @Regression', async ({ page }) => {
    const inventoryModule = new InventoryModule(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryModule.goto();
    await inventoryModule.addBackpackToCart();
    await expect(inventoryPage.backpackRemoveButton()).toBeVisible();
    await inventoryModule.removeBackpackFromCart();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await expect(inventoryPage.backpackAddToCartButton()).toBeVisible();
  });
});
