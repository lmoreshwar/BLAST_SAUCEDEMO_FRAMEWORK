import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CompletePurchasePage } from '../pages/CompletePurchasePage';
import { InventoryModule } from './InventoryModule';

export class CompletePurchaseModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CompletePurchaseModule');
  private readonly completePurchasePage: CompletePurchasePage;
  private readonly inventoryModule: InventoryModule;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.completePurchasePage = new CompletePurchasePage(page);
    this.inventoryModule = new InventoryModule(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the inventory page');
    await this.inventoryModule.goto();
  }

  async completePurchase(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    this.logger.step(2, 'Add the backpack and open checkout');
    await this.actions.click(this.completePurchasePage.backpackAddToCartButton());
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.completePurchasePage.checkoutButton());
    this.logger.step(3, 'Enter checkout information');
    await this.actions.fill(this.completePurchasePage.firstNameInput(), firstName ?? 'Jordan');
    await this.actions.fill(this.completePurchasePage.lastNameInput(), lastName ?? 'Rivera');
    await this.actions.fill(this.completePurchasePage.postalCodeInput(), postalCode ?? '94107');
    await this.actions.click(this.completePurchasePage.continueButton());
  }
}
