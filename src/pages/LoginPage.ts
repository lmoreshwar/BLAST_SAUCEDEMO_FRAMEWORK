import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }
}
