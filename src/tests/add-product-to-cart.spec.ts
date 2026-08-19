import { test, expect } from '../fixtures';
import { credentials, routes, urlFor } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { InventoryModule } from '../modules/InventoryModule';

 test.describe('Add Product to Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 add a product to the cart @AddProductToCart @Smoke @Regression', async ({ page }) => {
    const inventoryModule = new InventoryModule(page);
    await inventoryModule.goto();
    await inventoryModule.addBackpackToCart();
    await expect(page).toHaveURL(urlFor(routes.inventory));
  });

  test('TC_002 add multiple products to the cart @AddProductToCart @Regression', async ({ page }) => {
    const inventoryModule = new InventoryModule(page);
    await inventoryModule.goto();
    await inventoryModule.addBackpackToCart();
    await inventoryModule.addBikeLightToCart();
    await inventoryModule.addBoltTShirtToCart();
    await expect(page).toHaveURL(urlFor(routes.inventory));
  });
});
