import { type Page } from '@playwright/test';
import { credentials } from '../config';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
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
        this.logger.info('Open the Sauce Demo login page');
        await this.actions.navigate('/');
    }

    async login(username = credentials('app').username, password = credentials('app').password): Promise<void> {
        this.logger.info('Log in to the Sauce Demo application');
        await this.actions.fill(this.loginPage.username(), username);
        await this.actions.fill(this.loginPage.password(), password);
        await this.actions.click(this.loginPage.loginButton());
    }
}
