import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';

test.describe('Complete Product Purchase Journey', () => {
  // A standard user adds a backpack and reaches the checkout overview with valid information.
  test('TC_001 standard user can complete the product purchase journey @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const { username, password } = credentials('app');

    await purchaseModule.goto();
    await purchaseModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));

    await purchaseModule.addProduct();
    await purchaseModule.beginCheckout();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));

    await purchaseModule.submitCheckoutInformation(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode,
    );
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
