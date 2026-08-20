import { test, expect } from '../fixtures';
import { credentials, routes, urlFor, urlRegex } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { SideMenuModule } from '../modules/SideMenuModule';
import { SideMenuPage } from '../pages/SideMenuPage';

test.describe('Side Menu Logout', () => {
  test('TC_001 valid user can log out from the side menu @SideMenuLogout @Smoke @Regression', async ({ page }) => {
    const loginModule = new LoginModule(page);
    await loginModule.goto();
    await loginModule.login(credentials('app'));

    const sideMenuModule = new SideMenuModule(page);
    await sideMenuModule.goto();
    await sideMenuModule.logout();

    await expect(page).toHaveURL(urlRegex(routes.login));
    const sideMenuPage = new SideMenuPage(page);
    await expect(sideMenuPage.usernameInput()).toBeVisible();
  });
});
