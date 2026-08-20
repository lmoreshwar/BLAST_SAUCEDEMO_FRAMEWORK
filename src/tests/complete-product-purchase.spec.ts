import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';

test.describe('Complete Product Purchase', () => {
  test('TC_001 valid product purchase reaches checkout overview @CompletePurchase @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const completePurchaseModule = new CompletePurchaseModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
    await completePurchaseModule.completePurchase('Jordan', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });

  test('TC_002 checkout information is required @CompletePurchase @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const completePurchaseModule = new CompletePurchaseModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
    await completePurchaseModule.completePurchase();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepOne));
  });

  test('TC_003 checkout rejects script-like input without leaving the flow @CompletePurchase @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const completePurchaseModule = new CompletePurchaseModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));
    await completePurchaseModule.completePurchase('<script>alert(1)</script>', 'Rivera', '94107');
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
