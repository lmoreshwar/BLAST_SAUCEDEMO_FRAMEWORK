import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { CompletePurchaseModule } from '../modules/CompletePurchaseModule';

test.describe('Order Complete', () => {
  test('TC_001 complete a backpack order @CompletePurchase @Smoke @Regression', async ({ page }) => {
    const completePurchaseModule = new CompletePurchaseModule(page);
    await completePurchaseModule.completePurchase();
    await expect(page).toHaveURL(urlRegex(routes.checkoutStepTwo));
  });
});
