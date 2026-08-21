import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    constructor(private readonly page: Page) {}

    username = (): Locator => this.page.getByRole('textbox', { name: 'Username' });

    password = (): Locator => this.page.getByRole('textbox', { name: 'Password' });

    loginButton = (): Locator => this.page.getByRole('button', { name: 'Login' });
}
