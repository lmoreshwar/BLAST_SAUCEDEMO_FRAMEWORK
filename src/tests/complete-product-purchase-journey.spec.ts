import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';

test.describe('Complete Product Purchase Journey', () => {
  // A standard user can reach the checkout order-review page with valid information.
  test('TC_001 complete product purchase journey reaches order review @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.goto();
    await purchaseModule.login(username, password);
    await purchaseModule.startCheckout();
    await purchaseModule.submitCheckoutInformation('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
