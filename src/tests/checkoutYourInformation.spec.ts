import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { CheckoutYourInformationModule } from '../modules/CheckoutYourInformationModule';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';

const testData = {
  checkoutInformation: {
    firstName: 'Avery',
    lastName: 'Morgan',
    postalCode: '94107',
  },
};

test.describe('Checkout Your Information', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 valid information reaches checkout overview @CheckoutYourInformation @Smoke @Regression', async ({ page }) => {
    const checkoutModule = new CheckoutYourInformationModule(page);
    const checkoutPage = new CheckoutYourInformationPage(page);
    await checkoutModule.goto();
    await expect(checkoutPage.firstNameInput()).toBeVisible();
    await checkoutModule.enterInformation(
      testData.checkoutInformation.firstName,
      testData.checkoutInformation.lastName,
      testData.checkoutInformation.postalCode,
    );
    await checkoutModule.continue();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
