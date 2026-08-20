import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { InventoryModule } from '../modules/InventoryModule';
import { CheckoutYourInformationModule } from '../modules/CheckoutYourInformationModule';

test.describe('Checkout Your Information', () => {
  test('TC_001 valid checkout information reaches checkout overview @CheckoutYourInformation @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));

    const inventoryModule = new InventoryModule(page);
    await inventoryModule.addBackpackToCart();

    const checkoutYourInformationModule = new CheckoutYourInformationModule(page);
    await checkoutYourInformationModule.goto();
    await checkoutYourInformationModule.completeInformation(
      'Avery',
      'Morgan',
      '94107',
    );

    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
