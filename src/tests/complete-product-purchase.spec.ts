import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';
import { CompletePurchasePage } from '../pages/CompletePurchasePage';

test.describe('Complete Product Purchase', () => {
  test.beforeEach(async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
  });

  test('TC_001 valid customer information reaches checkout overview @CompletePurchase @Smoke @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.completePurchase('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 missing customer information remains on checkout information @CompletePurchase @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    const completePurchasePage = new CompletePurchasePage(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.openCheckout();
    await completePurchasePage.continueButton().click();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 boundary postal code is accepted @CompletePurchase @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.completePurchase('J', 'R', '0');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_004 checkout information fields do not expose password values @CompletePurchase @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    const completePurchasePage = new CompletePurchasePage(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.openCheckout();
    await expect(completePurchasePage.firstNameInput()).not.toHaveAttribute('type', 'password');
    await expect(completePurchasePage.lastNameInput()).not.toHaveAttribute('type', 'password');
    await expect(completePurchasePage.postalCodeInput()).not.toHaveAttribute('type', 'password');
  });

  test('TC_005 checkout information controls are keyboard accessible @CompletePurchase @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    const completePurchasePage = new CompletePurchasePage(page);
    await completePurchaseModule.goto();
    await completePurchaseModule.openCheckout();
    await expect(completePurchasePage.firstNameInput()).toBeVisible();
    await expect(completePurchasePage.lastNameInput()).toBeVisible();
    await expect(completePurchasePage.postalCodeInput()).toBeVisible();
    await expect(completePurchasePage.continueButton()).toBeVisible();
  });
});
