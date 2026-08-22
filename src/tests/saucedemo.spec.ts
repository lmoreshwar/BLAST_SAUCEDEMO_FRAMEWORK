import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { SauceDemoModule } from '../modules/SauceDemoModule';

test.describe('SauceDemo', () => {
  test('[TC_001] Login with valid credentials @SauceDemo @Smoke @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    await sauceDemoModule.goto();
    await sauceDemoModule.login();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });
});
