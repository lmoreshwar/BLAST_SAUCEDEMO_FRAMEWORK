import { test, expect } from '../fixtures';
import { credentials, routes, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';

test.describe('Login', () => {
  // Valid credentials should land on the inventory page.
  test('TC_001 valid credentials reach the app @Login @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    const { username, password } = credentials('app');
    await loginModule.goto();
    await loginModule.login(username, password);
    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });

  // Invalid credentials should stay on the login page.
  test('TC_002 invalid credentials remain on the login page @Login @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login('invalid_user', 'invalid_password');
    await expect(page).not.toHaveURL(urlRegex(routes.inventory));
  });
});
