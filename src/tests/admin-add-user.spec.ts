import { credentials } from '../config';
import { test, expect } from '../fixtures';
import { AdminAddUserModule } from '../modules/AdminAddUserModule';

test.describe('Admin Add User', () => {
    test('[TC_001] Admin can add a new user @AdminAddUser @Positive', async ({
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

        await expect(page).toHaveURL(/\/web\/index\.php\/admin\/saveSystemUser/);
    });
});
