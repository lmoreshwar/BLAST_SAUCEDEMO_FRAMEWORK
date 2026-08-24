import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

const testData = {
  checkout: {
    firstName: 'Jordan',
    lastName: 'Rivera',
    postalCode: '94107'
  }
};

test.describe('Complete Product Purchase Journey', () => {
  // Valid credentials and checkout information should reach checkout overview.
  test('TC_001 complete product purchase journey reaches checkout overview @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const journeyModule = new CompleteProductPurchaseJourneyModule(page);
    const journeyPage = new CompleteProductPurchaseJourneyPage(page);
    const { username, password } = credentials('app');

    await journeyModule.goto();
    await journeyModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await journeyModule.addBackpackToCart();
    await journeyModule.openAllItems();
    await journeyModule.beginCheckout();
    await journeyModule.submitCheckoutInformation(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );

    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
    await expect(journeyPage.openMenuButton()).toBeVisible();
  });
});
