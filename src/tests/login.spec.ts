import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';

test.describe('Valid User Login', () => {
  test('TC_001 valid credentials reach the inventory @Login @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login();
    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });
});
