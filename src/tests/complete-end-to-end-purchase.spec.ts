import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';

test.describe('Complete End-to-End Purchase', () => {
  test('TC_001 complete purchase reaches checkout overview @CompleteEndToEndPurchase @Smoke @Regression', async ({ page }) => {
    const purchaseModule = new CompletePurchaseModule(page);
    await purchaseModule.establishPurchase(credentials('app'));
    await purchaseModule.goto();
    await purchaseModule.completePurchase();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
