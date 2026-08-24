import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { AddToCartModule } from '../modules/AddToCartModule';

test.describe('SauceDemo', () => {
  test('[TC_001] Add the Sauce Labs Backpack to the cart @AddToCart @Smoke @Regression', async ({ page }) => {
    const addToCartModule = new AddToCartModule(page);
    await addToCartModule.goto();
    await addToCartModule.login();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await addToCartModule.addBackpackToCart();
    await expect(page.getByText('1', { exact: true })).toBeVisible();
  });
});
