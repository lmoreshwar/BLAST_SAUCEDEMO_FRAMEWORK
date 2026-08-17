import { type Locator, type Page } from '@playwright/test';

export class ProfileMenuPage {
    readonly profilePicture: Locator;
    readonly logoutMenuItem: Locator;

    constructor(private readonly page: Page) {
        this.profilePicture = page.getByRole('banner').getByRole('img', { name: 'profile picture' });
        this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    }
}
