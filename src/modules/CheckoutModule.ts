import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { CheckoutPage } from '../pages/CheckoutPage';

/** Checkout workflow: complete the customer information step. */
export class CheckoutModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('CheckoutModule');
  private readonly checkoutPage: CheckoutPage;

  constructor(page: Page) {
    this.actions = new Actions(page);
    this.checkoutPage = new CheckoutPage(page);
  }

  /** Fill the checkout information form and continue to order review. */
  async submitInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(1, 'Submit checkout information');
    await this.actions.fill(this.checkoutPage.firstNameInput(), firstName);
    await this.actions.fill(this.checkoutPage.lastNameInput(), lastName);
    await this.actions.fill(this.checkoutPage.postalCodeInput(), postalCode);
    await this.actions.click(this.checkoutPage.continueButton());
  }
}
