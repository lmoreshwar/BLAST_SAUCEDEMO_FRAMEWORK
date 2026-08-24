import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';

test.describe('Login', () => {
  test('TC_001 valid credentials reach the app @Login @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const { username, password } = credentials('app');
    await loginModule.goto();
    await loginModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });

  test('TC_002 invalid credentials remain on the login page @Login @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login('invalid_user', 'invalid_password');
    await expect(page).not.toHaveURL(urlRegex(routes.inventory));
  });
});
