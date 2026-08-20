import { type Page } from '@playwright/test';
import { credentials } from '../config';
import { Logger } from '../utils/Logger';
import { Actions } from '../utils/Actions';
import { LoginPage } from '../pages/LoginPage';

export class LoginModule {
    private readonly actions: Actions;
    private readonly loginPage: LoginPage;
    private readonly logger = Logger.create('LoginModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.loginPage = new LoginPage(page);
    }

    async goto(): Promise<void> {
        this.logger.info('Navigate to the login page');
        await this.actions.navigate('/');
    }

    async login(username = credentials('app').username, password = credentials('app').password): Promise<void> {
        this.logger.info('Enter the username');
        await this.actions.fill(this.loginPage.username, username);

        this.logger.info('Enter the password');
        await this.actions.fill(this.loginPage.password, password);

        this.logger.info('Submit the login request');
        await this.actions.click(this.loginPage.loginButton);
    }
}
