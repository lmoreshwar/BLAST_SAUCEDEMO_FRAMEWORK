import { test, expect } from '../fixtures';
import { credentials, urlRegex, routes } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { InventoryModule } from '../modules/InventoryModule';
import { CartModule } from '../modules/CartModule';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';
import { CheckoutOverviewModule } from '../modules/CheckoutOverviewModule';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';

test.describe('Checkout Overview', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 authenticated user reaches checkout overview with cart item @CheckoutOverview @Smoke @Regression', async ({ page }) => {
    const inventoryModule = new InventoryModule(page);
    const cartModule = new CartModule(page);
    const completePurchaseModule = new CompletePurchaseModule(page);
    const checkoutOverviewModule = new CheckoutOverviewModule(page);

    await inventoryModule.goto();
    await inventoryModule.addBackpackToCart();
    await cartModule.goto();
    await completePurchaseModule.completePurchase();
    await checkoutOverviewModule.goto();

    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 checkout overview displays the application menu control @CheckoutOverview @Regression', async ({ page }) => {
    const inventoryModule = new InventoryModule(page);
    const cartModule = new CartModule(page);
    const completePurchaseModule = new CompletePurchaseModule(page);
    const checkoutOverviewModule = new CheckoutOverviewModule(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await inventoryModule.goto();
    await inventoryModule.addBackpackToCart();
    await cartModule.goto();
    await completePurchaseModule.completePurchase();
    await checkoutOverviewModule.goto();

    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
    await expect(checkoutOverviewPage.openMenuButton()).toBeVisible();
  });
});
