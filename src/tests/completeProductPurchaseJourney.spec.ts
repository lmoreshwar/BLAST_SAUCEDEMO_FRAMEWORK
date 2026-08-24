import { test, expect } from '../fixtures';
import { credentials, routes, urlFor, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { CompleteProductPurchaseJourneyModule } from '../modules/CompleteProductPurchaseJourneyModule';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

test.describe('Complete Product Purchase Journey', () => {
  // A signed-in customer opens checkout information, submits valid details, and reaches order review.
  test('TC_001 customer can continue checkout with valid information @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompleteProductPurchaseJourneyModule(page);
    const purchasePage = new CompleteProductPurchaseJourneyPage(page);
    const { username, password } = credentials('app');

    await page.goto(urlFor(routes.login));
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(urlRegex(routes.inventory));

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.goto(urlFor(routes.cart));
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));

    await purchaseModule.enterCheckoutInformation(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );

    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
    await expect(purchasePage.firstNameInput()).not.toBeVisible();
  });
});
