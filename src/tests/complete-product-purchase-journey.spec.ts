import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';

test.describe('Complete Product Purchase Journey', () => {
  test('TC_001 completes checkout information with valid data @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    await purchaseModule.completePurchase('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 submits checkout information with a missing first name @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    await purchaseModule.goto();
    await purchaseModule.login();
    await purchaseModule.addBackpackToCart();
    await purchaseModule.openCart();
    await purchaseModule.startCheckout();
    await purchaseModule.submitCheckoutInformation('', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 accepts a boundary postal code value @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    await purchaseModule.goto();
    await purchaseModule.login();
    await purchaseModule.addBackpackToCart();
    await purchaseModule.openCart();
    await purchaseModule.startCheckout();
    await purchaseModule.submitCheckoutInformation('Jordan', 'Rivera', '0');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
