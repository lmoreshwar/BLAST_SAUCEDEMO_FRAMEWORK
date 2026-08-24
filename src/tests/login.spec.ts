import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { SauceDemoModule } from '../modules/SauceDemoModule';

test.describe('SauceDemo', () => {
  test('[TC_001] Login with valid credentials @SauceDemo @Smoke @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);
    const { username, password } = credentials('app');
    await sauceDemoModule.goto();
    await sauceDemoModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });
});
