import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { CartModule } from '../modules/CartModule';

test.describe('View Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 authenticated user views an added product in the cart @ViewCart @Smoke @Regression', async ({ page }) => {
    const cartModule = new CartModule(page);
    await cartModule.establishCart();
    await cartModule.goto();

    await expect(page).toHaveURL(urlRegex(routes.cart));
    await expect(cartModule.cartPage.backpackPrice()).toBeVisible();
  });
});
