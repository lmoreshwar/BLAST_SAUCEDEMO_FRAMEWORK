import { credentials } from '../config';
import { test, expect } from '../fixtures';
import { ProfileMenuModule } from '../modules/ProfileMenuModule';

test.describe('Profile Menu Logout', () => {
    test('[TC_001] Logout from the profile menu returns to the login page @ProfileMenuLogout @Positive', async ({
        loginModule,
        loginPage,
        dashboardModule,
        page,
    }) => {
        const appCredentials = credentials('app');
        const profileMenuModule = new ProfileMenuModule(page);

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await dashboardModule.waitForDashboard();
        await profileMenuModule.openProfileMenu();
        await profileMenuModule.logout();

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.usernameTextbox).toBeVisible();
        await expect(loginPage.passwordTextbox).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });
});
