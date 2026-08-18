import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { PimAddEmployeePage } from '../pages/PimAddEmployeePage';
import { routes, urlFor, urlRegex } from '../config';

export class PimAddEmployeeModule {
    private readonly actions: Actions;
    private readonly pimAddEmployeePage: PimAddEmployeePage;
    private readonly logger = Logger.create('PimAddEmployeeModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.pimAddEmployeePage = new PimAddEmployeePage(page);
    }

    async goto(): Promise<void> {
        this.logger.step(1, 'Open the Add Employee page');
        await this.page.goto(urlFor(routes.pimAddEmployee));
        await this.actions.waitForVisible(this.pimAddEmployeePage.addEmployeeHeading);
    }

    async addEmployee(firstName: string, lastName: string): Promise<void> {
        this.logger.step(2, 'Enter the employee name and save the employee');
        await this.actions.fill(this.pimAddEmployeePage.firstNameTextbox, firstName);
        await this.actions.fill(this.pimAddEmployeePage.lastNameTextbox, lastName);
        await this.actions.click(this.pimAddEmployeePage.saveButton);
        await this.page.waitForURL(urlRegex(routes.pimViewPersonalDetails));
    }
}
