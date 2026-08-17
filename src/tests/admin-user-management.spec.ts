import { credentials } from '../config';
import { test, expect } from '../fixtures';
import { AdminUserManagementModule } from '../modules/AdminUserManagementModule';

test.describe('Admin user management', () => {
    test('[TC_001] Authenticated navigation opens Admin user management @AdminUserManagement @Positive', async ({
        loginModule,
        page,
    }) => {
        const appCredentials = credentials('app');
        const adminUserManagementModule = new AdminUserManagementModule(page);

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await adminUserManagementModule.open();
        await adminUserManagementModule.search();

        await expect(page).toHaveURL(/\/web\/index\.php\/admin\/viewSystemUsers/);
        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    });
});
