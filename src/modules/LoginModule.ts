import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { LoginPage } from '../pages/LoginPage';
import { routes, urlFor } from '../config';

export class LoginModule {
    private readonly actions: Actions;
    private readonly loginPage: LoginPage;
    private readonly logger = Logger.create('LoginModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.loginPage = new LoginPage(page);
    }

    async goto(): Promise<void> {
        this.logger.info('Open the OrangeHRM login page');
        await this.page.goto(urlFor(routes.login));
        await this.actions.waitForVisible(this.loginPage.usernameTextbox);
    }

    async login(username: string, password: string): Promise<void> {
        this.logger.info('Enter valid credentials and submit the login form');
        await this.actions.fill(this.loginPage.usernameTextbox, username);
        await this.actions.fill(this.loginPage.passwordTextbox, password);
        await this.actions.click(this.loginPage.loginButton);
        await this.page.waitForURL(/\/web\/index\.php\/dashboard\/index/);
    }

    async loginWithEmptyUsername(password: string): Promise<void> {
        this.logger.info('Leave the username empty, enter the password, and submit the login form');
        await this.actions.fill(this.loginPage.passwordTextbox, password);
        await this.actions.click(this.loginPage.loginButton);
    }

    async loginWithEmptyPassword(username: string): Promise<void> {
        this.logger.info('Enter the username, leave the password empty, and submit the login form');
        await this.actions.fill(this.loginPage.usernameTextbox, username);
        await this.actions.clear(this.loginPage.passwordTextbox);
        await this.actions.click(this.loginPage.loginButton);
    }

    async loginWithEmptyCredentials(): Promise<void> {
        this.logger.info('Leave both login inputs empty and submit the login form');
        await this.actions.click(this.loginPage.loginButton);
    }

    async loginWithIncorrectPassword(username: string, password: string): Promise<void> {
        this.logger.info('Enter the username and incorrect password, then submit the login form');
        await this.actions.fill(this.loginPage.usernameTextbox, username);
        await this.actions.fill(this.loginPage.passwordTextbox, password);
        await this.actions.click(this.loginPage.loginButton);
    }

    async loginWithIncorrectUsername(username: string, password: string): Promise<void> {
        this.logger.info('Enter the incorrect username and password, then submit the login form');
        await this.actions.fill(this.loginPage.usernameTextbox, username);
        await this.actions.fill(this.loginPage.passwordTextbox, password);
        await this.actions.click(this.loginPage.loginButton);
    }

    async recoverFromIncorrectPassword(
        username: string,
        incorrectPassword: string,
        validPassword: string,
    ): Promise<void> {
        this.logger.info('Submit incorrect credentials, wait for the login form to settle, then submit valid credentials');
        await this.actions.fill(this.loginPage.usernameTextbox, username);
        await this.actions.fill(this.loginPage.passwordTextbox, incorrectPassword);
        await this.actions.click(this.loginPage.loginButton);
        await this.page.waitForLoadState('networkidle');
        await this.actions.waitForVisible(this.loginPage.usernameTextbox);
        await this.login(username, validPassword);
    }
}
