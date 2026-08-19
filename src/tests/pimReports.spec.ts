import { credentials, routes, urlRegex } from '../config';
import { test, expect } from '../fixtures';
import { PimReportsModule } from '../modules/PimReportsModule';
import { PimReportsPage } from '../pages/PimReportsPage';

test.describe('PIM Reports', () => {
    test.beforeEach(async ({ loginModule }) => {
        const appCredentials = credentials('app');

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
    });

    test('[TC_001] Reports page displays predefined employee reports @PimReports @Smoke @Regression', async ({ page }) => {
        const pimReportsModule = new PimReportsModule(page);
        const pimReportsPage = new PimReportsPage(page);

        await pimReportsModule.goto();

        await expect(page).toHaveURL(urlRegex(routes.pimReports));
        await expect(pimReportsPage.reportNameTextbox).toBeVisible();
        await expect(pimReportsPage.recordsFoundText).toBeVisible();
        await expect(pimReportsPage.addButton).toBeVisible();
    });

    test('[TC_002] Searching reports returns matching report results @PimReports @Regression', async ({ page }) => {
        const pimReportsModule = new PimReportsModule(page);
        const pimReportsPage = new PimReportsPage(page);

        await pimReportsModule.goto();
        await pimReportsModule.searchReport('Admin');

        await expect(page).toHaveURL(urlRegex(routes.pimReports));
        await expect(pimReportsPage.recordsFoundText).toBeVisible();
    });

    test('[TC_003] Reset clears the report search criteria @PimReports @Regression', async ({ page }) => {
        const pimReportsModule = new PimReportsModule(page);
        const pimReportsPage = new PimReportsPage(page);

        await pimReportsModule.goto();
        await pimReportsModule.searchReport('Admin');
        await pimReportsModule.resetSearch();

        await expect(pimReportsPage.reportNameTextbox).toHaveValue('');
        await expect(pimReportsPage.recordsFoundText).toBeVisible();
    });
});
