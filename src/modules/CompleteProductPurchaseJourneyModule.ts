import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

/** Product purchase journey workflow across login, inventory, cart, and checkout. */
export class CompleteProductPurchaseJourneyModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompleteProductPurchaseJourneyModule');
  private readonly journeyPage: CompleteProductPurchaseJourneyPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.journeyPage = new CompleteProductPurchaseJourneyPage(page);
  }

  /** Open the login page. */
  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), { readyElement: this.journeyPage.usernameInput() });
  }

  /** Log in with the supplied credentials. */
  async login(username: string, password: string): Promise<void> {
    this.logger.step(2, 'Submit credentials');
    await this.actions.fill(this.journeyPage.usernameInput(), username);
    await this.actions.fill(this.journeyPage.passwordInput(), password);
    await this.actions.click(this.journeyPage.loginButton());
  }

  /** Add the verified backpack product to the cart. */
  async addBackpackToCart(): Promise<void> {
    this.logger.step(3, 'Add the backpack to the cart');
    await this.actions.click(this.journeyPage.addBackpackToCartButton());
  }

  /** Open the inventory menu and return to all items. */
  async openAllItems(): Promise<void> {
    this.logger.step(4, 'Open the inventory menu');
    await this.actions.click(this.journeyPage.openMenuButton());
    await this.actions.click(this.journeyPage.inventorySidebarLink());
  }

  /** Open the cart and begin checkout. */
  async beginCheckout(): Promise<void> {
    this.logger.step(5, 'Open the cart and begin checkout');
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.journeyPage.checkoutButton());
  }

  /** Submit checkout information. */
  async submitCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(6, 'Submit checkout information');
    await this.actions.fill(this.journeyPage.firstNameInput(), firstName);
    await this.actions.fill(this.journeyPage.lastNameInput(), lastName);
    await this.actions.fill(this.journeyPage.postalCodeInput(), postalCode);
    await this.actions.click(this.journeyPage.continueButton());
  }
}
