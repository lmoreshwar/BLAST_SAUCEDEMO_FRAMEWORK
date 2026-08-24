import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompleteProductPurchaseJourneyPage } from '../pages/CompleteProductPurchaseJourneyPage';

/** Product purchase journey workflow for checkout information entry. */
export class CompleteProductPurchaseJourneyModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompleteProductPurchaseJourneyModule');
  private readonly purchasePage: CompleteProductPurchaseJourneyPage;

  constructor(page: Page) {
    this.actions = new Actions(page);
    this.purchasePage = new CompleteProductPurchaseJourneyPage(page);
  }

  /** Open the checkout information screen. */
  async goto(): Promise<void> {
    this.logger.step(1, 'Open the checkout information screen');
    await this.actions.navigate(urlFor(routes.checkoutStepOne), {
      readyElement: this.purchasePage.firstNameInput()
    });
  }

  /** Enter checkout information and continue to order review. */
  async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(2, 'Enter checkout information');
    await this.actions.fill(this.purchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.purchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.purchasePage.postalCodeInput(), postalCode);
    await this.actions.click(this.purchasePage.continueButton());
  }
}
