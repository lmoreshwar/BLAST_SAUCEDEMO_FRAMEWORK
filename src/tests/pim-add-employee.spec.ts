import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';
import { PimAddEmployeeModule } from '../modules/PimAddEmployeeModule';

test.describe('PIM Add Employee', () => {
    test('[TC_001] Add employee with valid details @PimAddEmployee @Smoke @Regression', async ({
        loginModule,
        page,
    }) => {
        const appCredentials = credentials('app');
        const pimAddEmployeeModule = new PimAddEmployeeModule(page);

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await pimAddEmployeeModule.goto();
        await pimAddEmployeeModule.addEmployee(
            testData.pimAddEmployee.firstName,
            testData.pimAddEmployee.lastName,
        );

        await expect(page).toHaveURL(urlRegex(routes.pimViewPersonalDetails));
    });
});
