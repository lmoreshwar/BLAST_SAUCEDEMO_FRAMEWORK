import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { LoginModule } from '../modules/LoginModule';
import { InventoryModule } from '../modules/InventoryModule';
import { CartModule } from '../modules/CartModule';
import { CheckoutModule } from '../modules/CheckoutModule';

test.describe('Complete Product Purchase Journey', () => {
  // A standard user can add a product and reach the checkout order-review page with valid information.
  test('TC_001 complete product purchase journey reaches order review @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const inventoryModule = new InventoryModule(page);
    const cartModule = new CartModule(page);
    const checkoutModule = new CheckoutModule(page);

    const { username, password } = credentials('app');
    const { firstName, lastName, postalCode } = testData.checkout;

    await loginModule.goto();
    await loginModule.login(username, password);
    await inventoryModule.addProductToCart('sauce-labs-backpack');
    await cartModule.proceedToCheckout();
    await checkoutModule.submitInformation(firstName, lastName, postalCode);
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
