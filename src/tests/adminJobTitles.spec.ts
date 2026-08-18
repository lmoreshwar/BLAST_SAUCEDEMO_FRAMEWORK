import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';
import { AdminJobTitlesPage } from '../pages/AdminJobTitlesPage';
import { AdminJobTitlesModule } from '../modules/AdminJobTitlesModule';

test.describe('Admin Job Titles', () => {
    test.beforeEach(async ({ loginModule }) => {
        const appCredentials = credentials('app');
        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
    });

    test('[TC_001] Add a job title with description and note @AdminJobTitles @Smoke @Regression', async ({ page }) => {
        const adminJobTitlesModule = new AdminJobTitlesModule(page);
        const adminJobTitlesPage = new AdminJobTitlesPage(page);
        const data = testData.adminJobTitles;

        await adminJobTitlesModule.goto();
        await adminJobTitlesModule.openAddForm();
        const jobTitle = await adminJobTitlesModule.createJobTitle(
            data.jobTitleSeed,
            data.description,
            data.note,
        );

        await expect(page).toHaveURL(urlRegex(routes.adminJobTitles));
        await expect(adminJobTitlesPage.jobTitlesHeading).toBeVisible();
        await expect(adminJobTitlesPage.createdJobTitle(jobTitle)).toBeVisible();
    });

    test('[TC_002] Open the Add Job Title form from the Job Titles list @AdminJobTitles @Regression', async ({ page }) => {
        const adminJobTitlesModule = new AdminJobTitlesModule(page);
        const adminJobTitlesPage = new AdminJobTitlesPage(page);

        await adminJobTitlesModule.goto();
        await adminJobTitlesModule.openAddForm();

        await expect(page).toHaveURL(urlRegex(routes.adminSaveJobTitle));
        await expect(adminJobTitlesPage.addJobTitleHeading).toBeVisible();
        await expect(adminJobTitlesPage.jobTitleTextbox).toBeVisible();
        await expect(adminJobTitlesPage.jobDescriptionTextbox).toBeVisible();
        await expect(adminJobTitlesPage.noteTextbox).toBeVisible();
        await expect(adminJobTitlesPage.saveButton).toBeVisible();
    });
});
