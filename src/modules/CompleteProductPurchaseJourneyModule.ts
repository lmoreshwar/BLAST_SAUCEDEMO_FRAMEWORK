import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

/** Complete product purchase workflow across login, inventory, cart, and checkout. */
export class CompleteProductPurchaseJourneyModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompleteProductPurchaseJourneyModule');
  private readonly purchasePage: CompleteProductPurchaseJourneyPage;

  constructor(page: Page) {
    this.actions = new Actions(page);
    this.purchasePage = new CompleteProductPurchaseJourneyPage(page);
  }

  /** Open the login page. */
  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.purchasePage.usernameInput() });
  }

  /** Sign in with the supplied credentials. */
  async login(username: string, password: string): Promise<void> {
    this.logger.step(2, 'Sign in to the application');
    await this.actions.fill(this.purchasePage.usernameInput(), username);
    await this.actions.fill(this.purchasePage.passwordInput(), password);
    await this.actions.click(this.purchasePage.loginButton());
  }

  /** Add the backpack to the cart. */
  async addProduct(): Promise<void> {
    this.logger.step(3, 'Add the backpack to the cart');
    await this.actions.click(this.purchasePage.addToCartButton());
  }

  /** Open the cart and begin checkout. */
  async beginCheckout(): Promise<void> {
    this.logger.step(4, 'Open the cart and begin checkout');
    await this.actions.click(this.purchasePage.openMenuButton());
    await this.actions.navigate(urlFor(routes.cart), { readyElement: this.purchasePage.checkoutButton() });
    await this.actions.click(this.purchasePage.checkoutButton());
  }

  /** Submit checkout information. */
  async submitCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(5, 'Submit checkout information');
    await this.actions.fill(this.purchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.purchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.purchasePage.postalCodeInput(), postalCode);
    await this.actions.click(this.purchasePage.continueButton());
  }
}
