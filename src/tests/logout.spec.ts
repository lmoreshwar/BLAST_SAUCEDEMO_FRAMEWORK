import { test, expect } from '../fixtures';
import { credentials, routes, urlFor } from '../config';
import { LoginModule } from '../modules/LoginModule';
import { SideMenuModule } from '../modules/SideMenuModule';
import { LoginPage } from '../pages/LoginPage';
import { SideMenuPage } from '../pages/SideMenuPage';

test.describe('Side Menu', () => {
    test.beforeEach(async ({ page }) => {
        const loginModule = new LoginModule(page);
        await loginModule.goto();
        await loginModule.login(credentials('app'));
        await expect(page).toHaveURL(urlFor(routes.inventory));
    });

    test('TC_001 logout through hamburger menu @SideMenu @Smoke @Regression', async ({ page }) => {
        const sideMenuModule = new SideMenuModule(page);

        await sideMenuModule.logout();

        await expect(page).toHaveURL(urlFor(routes.login));
    });

    test('TC_002 hamburger menu provides logout option @SideMenu @Logout @Authentication @UI @Regression', async ({
        page,
    }) => {
        const sideMenuModule = new SideMenuModule(page);
        const sideMenuPage = new SideMenuPage(page);

        await sideMenuModule.openMenu();

        await expect(sideMenuPage.logoutLink()).toBeVisible();
    });

    test('TC_006 browser back navigation does not restore authenticated access @SideMenu @Logout @Authentication @Session @Navigation @Regression', async ({
        page,
    }) => {
        const sideMenuModule = new SideMenuModule(page);
        const loginPage = new LoginPage(page);

        await sideMenuModule.logout();
        await expect(page).toHaveURL(urlFor(routes.login));

        await sideMenuModule.goBack();

        await expect(page).toHaveURL(urlFor(routes.login));
        await expect(loginPage.loginButton()).toBeVisible();
    });

    test('TC_007 repeated logout action after session termination @SideMenu @Logout @Authentication @Session @Regression', async ({
        page,
    }) => {
        const sideMenuModule = new SideMenuModule(page);

        await sideMenuModule.logout();
        await expect(page).toHaveURL(urlFor(routes.login));

        const repeatedLogoutPerformed = await sideMenuModule.attemptRepeatedLogout();

        await expect(page).toHaveURL(urlFor(routes.login));
        expect(repeatedLogoutPerformed).toBe(false);
    });
});
