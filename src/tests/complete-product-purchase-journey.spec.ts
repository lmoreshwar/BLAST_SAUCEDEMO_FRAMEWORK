import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';

 test.describe('Complete Product Purchase Journey', () => {
  test('TC_001 valid customer information reaches order overview @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.goto();
    await purchaseModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await purchaseModule.addBackpackAndOpenCheckout();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
    await purchaseModule.enterCustomerInformation('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 missing customer information remains on checkout form @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.goto();
    await purchaseModule.login(username, password);
    await purchaseModule.addBackpackAndOpenCheckout();
    await purchaseModule.enterCustomerInformation('', '', '');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 boundary postal code value is accepted for checkout information @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const { username, password } = credentials('app');
    await purchaseModule.goto();
    await purchaseModule.login(username, password);
    await purchaseModule.addBackpackAndOpenCheckout();
    await purchaseModule.enterCustomerInformation('J', 'R', '0');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
