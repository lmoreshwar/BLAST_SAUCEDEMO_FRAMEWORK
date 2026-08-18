import { type Locator, type Page } from '@playwright/test';

export class PimAddEmployeePage {
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly saveButton: Locator;
    readonly addEmployeeHeading: Locator;

    constructor(private readonly page: Page) {
        this.firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
    }
}
