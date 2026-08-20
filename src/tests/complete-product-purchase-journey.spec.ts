import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';

const testData = {
  validFirstName: 'Jordan',
  validLastName: 'Rivera',
  validPostalCode: '94107',
  emptyFirstName: '',
  emptyLastName: '',
  emptyPostalCode: ''
};

test.describe('Complete Product Purchase Journey', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 completes a backpack purchase journey @CompleteProductPurchaseJourney @Smoke @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.completePurchase(
      testData.validFirstName,
      testData.validLastName,
      testData.validPostalCode
    );
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 rejects checkout when required information is empty @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.completePurchase(
      testData.emptyFirstName,
      testData.emptyLastName,
      testData.emptyPostalCode
    );
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 accepts a boundary postal code value @CompleteProductPurchaseJourney @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.completePurchase(
      testData.validFirstName,
      testData.validLastName,
      '0'
    );
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
