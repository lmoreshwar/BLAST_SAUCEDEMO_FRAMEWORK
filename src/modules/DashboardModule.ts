import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { DashboardPage } from '../pages/DashboardPage';
import { Logger } from '../utils/Logger';

export class DashboardModule {
    private readonly actions: Actions;
    private readonly dashboardPage: DashboardPage;
    private readonly logger = Logger.create('DashboardModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.dashboardPage = new DashboardPage(page);
    }

    async waitForDashboard(): Promise<void> {
        this.logger.info('Wait for the authenticated dashboard');
        await this.actions.waitForVisible(this.dashboardPage.dashboardHeading);
    }

    async openProfileMenu(): Promise<void> {
        this.logger.info('Open profile menu');
        await this.actions.click(this.dashboardPage.profileMenuButton);
    }

    async logout(): Promise<void> {
        this.logger.info('Log out');
        await this.actions.waitForVisible(this.dashboardPage.logoutLink);
        await this.actions.click(this.dashboardPage.logoutLink);
    }
}
