import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { SauceDemoModule } from '../modules/SauceDemoModule';
import { SauceDemoPage } from '../pages/SauceDemoPage';

test.describe('SauceDemo', () => {
  test('TC_004 Verify Price High-Low sorting option and ordering @SauceDemo @Smoke @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    const sauceDemoPage = new SauceDemoPage(page);
    const { username, password } = credentials('app');

    await sauceDemoModule.goto();
    await sauceDemoModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
    await sauceDemoModule.sortByPriceHighToLow();

    await expect(sauceDemoPage.fleeceJacketImage()).toBeVisible();
    await expect(sauceDemoPage.backpackImage()).toBeVisible();
    await expect(sauceDemoPage.bikeLightImage()).toBeVisible();
    await expect(sauceDemoPage.boltTShirtImage()).toBeVisible();
    await expect(sauceDemoPage.onesieImage()).toBeVisible();
    await expect(sauceDemoPage.redTShirtImage()).toBeVisible();
  });
});
