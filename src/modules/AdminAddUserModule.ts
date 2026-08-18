import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { AdminAddUserPage } from '../pages/AdminAddUserPage';
import { routes, urlFor } from '../config';

export class AdminAddUserModule {
    private readonly actions: Actions;
    private readonly adminAddUserPage: AdminAddUserPage;
    private readonly logger = Logger.create('AdminAddUserModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.adminAddUserPage = new AdminAddUserPage(page);
    }

    async goto(): Promise<void> {
        this.logger.step(1, 'Open the Add User page');
        await this.page.goto(urlFor(routes.adminAddUser));
        await this.actions.waitForVisible(this.adminAddUserPage.saveButton);
    }

    async addUser(employeeName: string, username: string, firstName: string, lastName: string): Promise<void> {
        this.logger.step(2, 'Enter the employee and user details');
        await this.actions.fill(this.adminAddUserPage.employeeNameTextbox, employeeName);
        await this.actions.fill(this.adminAddUserPage.usernameTextbox, username);
        await this.actions.fill(this.adminAddUserPage.firstNameTextbox, firstName);
        await this.actions.fill(this.adminAddUserPage.lastNameTextbox, lastName);
        this.logger.step(3, 'Save the new user');
        await this.actions.click(this.adminAddUserPage.saveButton);
    }
}
