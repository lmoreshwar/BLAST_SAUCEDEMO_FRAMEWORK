import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { ProductPurchaseModule } from '../modules/ProductPurchaseModule';

test.describe('Complete Product Purchase Journey', () => {
  test('TC_001 standard user reaches checkout review with valid customer information @ProductPurchase @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new ProductPurchaseModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.login(username, password);
    await purchaseModule.goto();
    await purchaseModule.addBackpackAndOpenCheckout();
    await purchaseModule.enterCustomerInformation('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 checkout information cannot continue with a blank first name @ProductPurchase @Regression', async ({ page }) => {
    const purchaseModule = new ProductPurchaseModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.login(username, password);
    await purchaseModule.goto();
    await purchaseModule.addBackpackAndOpenCheckout();
    await purchaseModule.enterCustomerInformation('', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 checkout information accepts a boundary one-character customer name @ProductPurchase @Regression', async ({ page }) => {
    const purchaseModule = new ProductPurchaseModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.login(username, password);
    await purchaseModule.goto();
    await purchaseModule.addBackpackAndOpenCheckout();
    await purchaseModule.enterCustomerInformation('J', 'R', '0');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
