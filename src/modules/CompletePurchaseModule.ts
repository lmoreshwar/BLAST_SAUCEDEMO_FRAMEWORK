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
    this.logger.step(1, 'Open the inventory page');
    await this.actions.navigate(urlFor(routes.inventory));
  }

  async openCheckout(): Promise<void> {
    this.logger.step(2, 'Add the backpack and open checkout');
    await this.actions.click(this.completePurchasePage.backpackAddToCartButton());
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.completePurchasePage.checkoutButton());
  }

  async completePurchase(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.openCheckout();
    this.logger.step(3, 'Enter checkout information');
    await this.actions.fill(this.completePurchasePage.firstNameInput(), firstName);
    await this.actions.fill(this.completePurchasePage.lastNameInput(), lastName);
    await this.actions.fill(this.completePurchasePage.postalCodeInput(), postalCode);
    await this.actions.click(this.completePurchasePage.continueButton());
  }
}
