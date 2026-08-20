import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';

export class CheckoutYourInformationModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('CheckoutYourInformationModule');
  private readonly checkoutPage: CheckoutYourInformationPage;

  constructor(private readonly page: Page) {
    this.actions = new Actions(page);
    this.checkoutPage = new CheckoutYourInformationPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open checkout information');
    await this.actions.navigate(urlFor(routes.checkoutStepOne), {
      readyElement: this.checkoutPage.firstNameInput(),
    });
  }

  async enterInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(2, 'Enter checkout information');
    await this.actions.fill(this.checkoutPage.firstNameInput(), firstName);
    await this.actions.fill(this.checkoutPage.lastNameInput(), lastName);
    await this.actions.fill(this.checkoutPage.postalCodeInput(), postalCode);
  }

  async continue(): Promise<void> {
    this.logger.step(3, 'Continue to checkout overview');
    await this.actions.click(this.checkoutPage.continueButton());
  }
}
