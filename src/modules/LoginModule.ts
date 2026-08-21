import { type Page } from '@playwright/test';
import { credentials } from '../config';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { LoginPage } from '../pages/LoginPage';

export class LoginModule {
    private readonly actions: Actions;
    private readonly loginPage: LoginPage;
    private readonly logger = Logger.create('LoginModule');

    constructor(page: Page) {
        this.actions = new Actions(page);
        this.loginPage = new LoginPage(page);
    }

    async goto(): Promise<void> {
        this.logger.info('Navigate to the Sauce Demo login page');
        await this.actions.navigate('/');
    }

    async login(): Promise<void> {
        const appCredentials = credentials('app');

        this.logger.info('Enter valid application credentials');
        await this.actions.fill(this.loginPage.username(), appCredentials.username);
        await this.actions.fill(this.loginPage.password(), appCredentials.password);

        this.logger.info('Submit the login form');
        await this.actions.click(this.loginPage.loginButton());
    }
}
