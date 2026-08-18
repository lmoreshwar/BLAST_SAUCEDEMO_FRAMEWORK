import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';
import { PimAddEmployeeModule } from '../modules/PimAddEmployeeModule';

test.describe('PIM Add Employee', () => {
    test.beforeEach(async ({ loginModule }) => {
        const appCredentials = credentials('app');
        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
    });

    test('[TC_001] Add an employee with valid required details @PimAddEmployee @Smoke @Regression', async ({ page }) => {
        const pimAddEmployeeModule = new PimAddEmployeeModule(page);
        const employee = testData.pimAddEmployee.validEmployee;

        await pimAddEmployeeModule.goto();
        await pimAddEmployeeModule.addEmployee(employee.firstName, employee.lastName);

        await expect(page).toHaveURL(urlRegex(routes.pimViewPersonalDetails));
    });
});
