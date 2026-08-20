import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

export class CompleteProductPurchaseJourneyModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompleteProductPurchaseJourneyModule');
  private readonly purchasePage: CompleteProductPurchaseJourneyPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.purchasePage = new CompleteProductPurchaseJourneyPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.purchasePage.usernameInput() });
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.step(2, 'Submit credentials');
    await this.actions.fill(this.purchasePage.usernameInput(), username);
    await this.actions.fill(this.purchasePage.passwordInput(), password);
    await this.actions.click(this.purchasePage.loginButton());
  }

  async addBackpackAndOpenCheckout(): Promise<void> {
    this.logger.step(3, 'Add the Sauce Labs Backpack and open checkout');
    await this.actions.click(this.purchasePage.backpackAddToCartButton());
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.purchasePage.checkoutButton());
  }

  async enterCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(4, 'Enter customer information');
    await this.actions.fill(this.purchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.purchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.purchasePage.postalCodeInput(), postalCode);
    await this.actions.click(this.purchasePage.continueButton());
  }
}
