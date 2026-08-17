import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { ProfileMenuPage } from '../pages/ProfileMenuPage';

export class ProfileMenuModule {
    private readonly actions: Actions;
    private readonly profileMenuPage: ProfileMenuPage;
    private readonly logger = Logger.create('ProfileMenuModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.profileMenuPage = new ProfileMenuPage(page);
    }

    async openProfileMenu(): Promise<void> {
        this.logger.step(1, 'Open the profile menu');
        await this.actions.click(this.profileMenuPage.profilePicture);
        await this.actions.waitForVisible(this.profileMenuPage.logoutMenuItem);
    }

    async logout(): Promise<void> {
        this.logger.step(2, 'Select Logout from the profile menu');
        await this.actions.click(this.profileMenuPage.logoutMenuItem);
        await this.page.waitForURL(/\/web\/index\.php\/auth\/login/);
    }
}
