import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { WorkflowActions } from '../utils/WorkflowActions';
import { credentials, routes, urlFor, type Credentials } from '../config';
import { LoginModule } from './LoginModule';
import { InventoryModule } from './InventoryModule';
import { CompletePurchasePage } from '../pages/CompletePurchasePage';

export class CompletePurchaseModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly workflowActions: WorkflowActions;
  private readonly logger = Logger.create('CompletePurchaseModule');
  private readonly purchasePage: CompletePurchasePage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.workflowActions = new WorkflowActions(page);
    this.purchasePage = new CompletePurchasePage(page);
  }

  async establishPurchase(loginCredentials: Credentials = credentials('app')): Promise<void> {
    const loginModule = new LoginModule(this.page);
    await loginModule.goto();
    await loginModule.login(loginCredentials);
    const inventoryModule = new InventoryModule(this.page);
    await inventoryModule.addBackpackToCart();
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the cart');
    await this.actions.navigate(urlFor(routes.cart), { readyElement: this.purchasePage.checkoutButton() });
  }

  async completePurchase(): Promise<void> {
    this.logger.step(2, 'Start checkout');
    await this.actions.click(this.purchasePage.checkoutButton());
    await this.actions.fill(this.purchasePage.firstNameInput(), 'Jordan');
    await this.actions.fill(this.purchasePage.lastNameInput(), 'Rivera');
    await this.actions.fill(this.purchasePage.postalCodeInput(), '94107');
    await this.actions.click(this.purchasePage.continueButton());
  }
}
