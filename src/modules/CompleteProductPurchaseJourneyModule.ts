import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

/** Complete product purchase journey workflow. */
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

  /** Open the login page and wait for the username field. */
  async goto(): Promise<void> {
    this.logger.step(1, 'Open the login page');
    await this.actions.navigate(urlFor(routes.login), {
      readyElement: this.page.locator('[data-test="username"]'),
    });
  }

  /** Log in with the standard application credentials. */
  async login(username: string, password: string): Promise<void> {
    this.logger.step(2, 'Submit credentials');
    await this.actions.fill(this.page.locator('[data-test="username"]'), username);
    await this.actions.fill(this.page.locator('[data-test="password"]'), password);
    await this.actions.click(this.page.locator('[data-test="login-button"]'));
  }

  /** Add the backpack and open checkout. */
  async startCheckout(): Promise<void> {
    this.logger.step(3, 'Add the backpack and open checkout');
    await this.actions.navigate(urlFor(routes.inventory));
    await this.actions.click(this.purchasePage.backpackAddToCartButton());
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.purchasePage.checkoutButton());
  }

  /** Submit checkout information and continue to order review. */
  async submitCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(4, 'Submit checkout information');
    await this.actions.fill(this.purchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.purchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.purchasePage.postalCodeInput(), postalCode);
    await this.actions.click(this.purchasePage.continueButton());
  }
}
