import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompletePurchasePage } from '../pages/CompletePurchasePage';

export class CompletePurchaseModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompletePurchaseModule');
  private readonly completePurchasePage: CompletePurchasePage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.completePurchasePage = new CompletePurchasePage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the cart page');
    await this.actions.navigate(urlFor(routes.cart));
  }

  async completePurchase(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    this.logger.step(2, 'Add a product and open checkout');
    await this.actions.navigate(urlFor(routes.inventory));
    await this.actions.click(this.completePurchasePage.backpackAddToCartButton());
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.completePurchasePage.checkoutButton());
    if (firstName !== undefined) {
      await this.actions.fill(this.completePurchasePage.firstNameInput(), firstName);
    }
    if (lastName !== undefined) {
      await this.actions.fill(this.completePurchasePage.lastNameInput(), lastName);
    }
    if (postalCode !== undefined) {
      await this.actions.fill(this.completePurchasePage.postalCodeInput(), postalCode);
    }
    await this.actions.click(this.completePurchasePage.continueButton());
  }
}
