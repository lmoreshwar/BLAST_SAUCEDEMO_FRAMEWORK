import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { ProductDetailsModule } from '../modules/ProductDetailsModule';

test.describe('Product Details', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 product details page opens for the Sauce Labs Backpack @ProductDetails @Smoke @Regression', async ({ page }) => {
    const productDetailsModule = new ProductDetailsModule(page);
    await productDetailsModule.goto();
    await expect(page).toHaveURL(urlRegex(routes.productDetails));
  });
});
