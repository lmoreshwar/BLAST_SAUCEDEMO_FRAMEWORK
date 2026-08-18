import { type Locator, type Page } from '@playwright/test';

export class AdminAddUserPage {
    readonly employeeNameTextbox: Locator;
    readonly usernameTextbox: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly saveButton: Locator;

    constructor(private readonly page: Page) {
        this.employeeNameTextbox = page.getByRole('textbox', { name: 'Type for hints...' });
        this.usernameTextbox = page.getByRole('textbox').nth(2);
        this.firstNameTextbox = page.getByRole('textbox').nth(3);
        this.lastNameTextbox = page.getByRole('textbox').nth(4);
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }
}
