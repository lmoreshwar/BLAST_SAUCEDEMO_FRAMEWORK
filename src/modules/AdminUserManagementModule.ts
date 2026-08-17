import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { AdminUserManagementPage } from '../pages/AdminUserManagementPage';

export class AdminUserManagementModule {
    private readonly actions: Actions;
    private readonly adminUserManagementPage: AdminUserManagementPage;
    private readonly logger = Logger.create('AdminUserManagementModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.adminUserManagementPage = new AdminUserManagementPage(page);
    }

    async open(): Promise<void> {
        this.logger.step(1, 'Open Admin user management');
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
        await this.actions.waitForVisible(this.adminUserManagementPage.searchButton);
    }

    async search(): Promise<void> {
        this.logger.step(2, 'Submit the Admin user management search form');
        await this.actions.click(this.adminUserManagementPage.searchButton);
    }
}
