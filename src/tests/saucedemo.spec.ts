import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { SauceDemoModule } from '../modules/SauceDemoModule';

const testData = {
  expectedLowToHighPrices: ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'],
  expectedHighToLowPrices: ['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99'],
};

test.describe('SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    await sauceDemoModule.login();
  });

  test('TC_003 Verify Price Low-High sorting option and ordering @SauceDemo @Smoke @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    await sauceDemoModule.goto();
    await sauceDemoModule.selectPriceLowToHigh();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await expect(page.locator('[data-test="inventory-item-price"]').allTextContents()).resolves.toEqual(testData.expectedLowToHighPrices);
  });

  test('TC_004 Verify Price High-Low sorting option and ordering @SauceDemo @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    await sauceDemoModule.goto();
    await sauceDemoModule.selectPriceHighToLow();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await expect(page.locator('[data-test="inventory-item-price"]').allTextContents()).resolves.toEqual(testData.expectedHighToLowPrices);
  });
});
