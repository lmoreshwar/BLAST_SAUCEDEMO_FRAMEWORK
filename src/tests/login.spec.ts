import { credentials } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';

test.describe('Login', () => {
    test('[TC_001] Valid credentials reach the authenticated dashboard @Login @Smoke @Regression', async ({
        loginModule,
        dashboardModule,
        dashboardPage,
        page,
    }) => {
        const appCredentials = credentials('app');

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await dashboardModule.waitForDashboard();

        await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/);
        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });

    test('[TC_002] Empty Username blocks login @Login @Regression', async ({
        loginModule,
        loginPage,
        page,
    }) => {
        await loginModule.goto();
        await loginModule.loginWithEmptyUsername(testData.emptyUsername.password);

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.usernameTextbox).toBeVisible();
    });

    test('[TC_003] Empty Password blocks login @Login @Regression', async ({
        loginModule,
        loginPage,
        page,
    }) => {
        await loginModule.goto();
        await loginModule.loginWithEmptyPassword(testData.emptyPassword.username);

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.passwordTextbox).toHaveValue('');
        await expect(loginPage.passwordTextbox).toBeVisible();
    });

    test('[TC_004] Both empty inputs block login @Login @Regression', async ({
        loginModule,
        loginPage,
        page,
    }) => {
        await loginModule.goto();
        await loginModule.loginWithEmptyCredentials();

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.usernameTextbox).toHaveValue('');
        await expect(loginPage.passwordTextbox).toHaveValue('');
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('[TC_005] Incorrect password does not authenticate @Login @Regression', async ({
        loginModule,
        loginPage,
        page,
    }) => {
        const appCredentials = credentials('app');

        await loginModule.goto();
        await loginModule.loginWithIncorrectPassword(appCredentials.username, testData.incorrectPassword);

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('[TC_006] Incorrect username does not authenticate @Login @Regression', async ({
        loginModule,
        loginPage,
        page,
    }) => {
        await loginModule.goto();
        await loginModule.loginWithIncorrectUsername(
            testData.incorrectUsername,
            testData.incorrectUsernamePassword,
        );

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('[TC_007] Correcting invalid credentials allows recovery @Login @Regression', async ({
        loginModule,
        dashboardPage,
        page,
    }) => {
        const appCredentials = credentials('app');

        await loginModule.goto();
        await loginModule.recoverFromIncorrectPassword(
            appCredentials.username,
            testData.incorrectPassword,
            appCredentials.password,
        );

        await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/);
        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });
});
