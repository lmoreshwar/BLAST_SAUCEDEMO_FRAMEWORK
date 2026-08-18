import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';
import { AdminAddUserModule } from '../modules/AdminAddUserModule';

test.describe('Admin Add User', () => {
    test('[TC_001] Admin can add a new user @AdminAddUser @Smoke @Regression', async ({
        page,
        loginModule,
        dashboardModule,
    }) => {
        const appCredentials = credentials('app');
        const adminAddUserModule = new AdminAddUserModule(page);

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await dashboardModule.waitForDashboard();
        await adminAddUserModule.goto();
        await adminAddUserModule.addUser(
            'Admin',
            'testuser_automation_2026',
            'Test',
            'User',
        );

        await expect(page).toHaveURL(urlRegex(routes.adminAddUser));
    });

    test('[TC_002] Admin can add another user with distinct details @AdminAddUser @Regression', async ({
        page,
        loginModule,
        dashboardModule,
    }) => {
        const appCredentials = credentials('app');
        const { employeeName, username, firstName, lastName } = testData.adminUser;
        const adminAddUserModule = new AdminAddUserModule(page);

        // Independent session: authenticate and reach the Add User screen from scratch.
        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await dashboardModule.waitForDashboard();
        await adminAddUserModule.goto();
        await adminAddUserModule.addUser(employeeName, username, firstName, lastName);

        await expect(page).toHaveURL(urlRegex(routes.adminAddUser));
    });
});
