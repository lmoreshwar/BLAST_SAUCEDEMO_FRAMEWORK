import { test, expect } from '../fixtures';
import { routes, urlRegex } from '../config';
import { SauceDemoModule } from '../modules/SauceDemoModule';

test.describe('SauceDemo', () => {
  // Valid credentials authenticate the user and open the inventory page.
  test('[TC_001] Login with valid credentials @SauceDemo @Smoke @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);

    await sauceDemoModule.goto();
    await sauceDemoModule.loginWithValidCredentials();

    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });

  // Successful authentication redirects the user to the inventory route.
  test('[TC_002] Redirect to inventory page after successful login @SauceDemo @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);

    await sauceDemoModule.goto();
    await sauceDemoModule.loginWithValidCredentials();

    await expect(page).toHaveURL(urlRegex(routes.inventory));
  });

  // Invalid credentials keep the user on the login screen.
  test('[TC_003] Error for invalid credentials @SauceDemo @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);

    await sauceDemoModule.goto();
    await sauceDemoModule.loginWithInvalidCredentials();

    await expect(page).toHaveURL(urlRegex(routes.login));
  });

  // Empty credentials keep the user on the login screen.
  test('[TC_004] Error when both username and password are empty @SauceDemo @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);

    await sauceDemoModule.goto();
    await sauceDemoModule.submitEmptyLogin();

    await expect(page).toHaveURL(urlRegex(routes.login));
  });

  // A username without a password keeps the user on the login screen.
  test('[TC_005] Error when either username or password is empty @SauceDemo @Regression', async ({ page }) => {
    const sauceDemoModule = new SauceDemoModule(page);

    await sauceDemoModule.goto();
    await sauceDemoModule.submitWithUsernameOnly();

    await expect(page).toHaveURL(urlRegex(routes.login));
  });
});
