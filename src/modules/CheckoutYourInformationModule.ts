import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';

export class CheckoutYourInformationModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CheckoutYourInformationModule');
  private readonly checkoutYourInformationPage: CheckoutYourInformationPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.checkoutYourInformationPage = new CheckoutYourInformationPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the checkout information page');
    await this.actions.navigate(urlFor(routes.checkoutStepOne), {
      readyElement: this.checkoutYourInformationPage.firstNameInput(),
    });
  }

  async completeInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.step(2, 'Complete checkout information');
    await this.actions.fill(this.checkoutYourInformationPage.firstNameInput(), firstName);
    await this.actions.fill(this.checkoutYourInformationPage.lastNameInput(), lastName);
    await this.actions.fill(this.checkoutYourInformationPage.postalCodeInput(), postalCode);
    await this.actions.click(this.checkoutYourInformationPage.continueButton());
  }
}
