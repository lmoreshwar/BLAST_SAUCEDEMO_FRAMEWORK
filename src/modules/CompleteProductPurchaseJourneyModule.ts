import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor, credentials } from '../config';
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

  async login(): Promise<void> {
    this.logger.step(2, 'Submit valid credentials');
    const { username, password } = credentials('app');
    await this.actions.fill(this.purchasePage.usernameInput(), username);
    await this.actions.fill(this.purchasePage.passwordInput(), password);
    await this.actions.click(this.purchasePage.loginButton());
  }

  async addBackpackToCart(): Promise<void> {
    this.logger.step(3, 'Add the backpack to the cart');
    await this.actions.click(this.purchasePage.backpackAddToCartButton());
  }

  async openCart(): Promise<void> {
    this.logger.step(4, 'Open the cart');
    await this.actions.navigate(urlFor(routes.cart));
  }

  async startCheckout(): Promise<void> {
    this.logger.step(5, 'Start checkout');
    await this.actions.click(this.purchasePage.checkoutButton());
  }

  async enterCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(6, 'Enter customer information');
    await this.actions.fill(this.purchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.purchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.purchasePage.postalCodeInput(), postalCode);
  }

  async continueToOverview(): Promise<void> {
    this.logger.step(7, 'Continue to order overview');
    await this.actions.click(this.purchasePage.continueButton());
  }

  async completePurchase(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.goto();
    await this.login();
    await this.addBackpackToCart();
    await this.openCart();
    await this.startCheckout();
    await this.enterCustomerInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
  }

  async submitCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterCustomerInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
  }
}
