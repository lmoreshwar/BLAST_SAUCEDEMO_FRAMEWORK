import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';

export class CheckoutOverviewModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CheckoutOverviewModule');
  private readonly checkoutOverviewPage: CheckoutOverviewPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the checkout overview page');
    await this.actions.navigate(urlFor(routes.checkoutStepTwo));
  }
}
