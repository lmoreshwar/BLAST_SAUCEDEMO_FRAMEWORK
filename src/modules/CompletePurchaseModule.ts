import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { credentials, routes, urlFor } from '../config';
import { LoginModule } from './LoginModule';
import { InventoryModule } from './InventoryModule';
import { CheckoutYourInformationModule } from './CheckoutYourInformationModule';
import { CheckoutOverviewModule } from './CheckoutOverviewModule';
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
    this.logger.step(1, 'Open the checkout overview page');
    await this.actions.navigate(urlFor(routes.checkoutStepTwo));
  }

  async completePurchase(): Promise<void> {
    const loginModule = new LoginModule(this.page);
    const inventoryModule = new InventoryModule(this.page);
    const checkoutYourInformationModule = new CheckoutYourInformationModule(this.page);
    const checkoutOverviewModule = new CheckoutOverviewModule(this.page);

    await loginModule.goto();
    await loginModule.login(credentials('app'));
    await inventoryModule.addBackpackToCart();
    await this.actions.navigate(urlFor(routes.cart));
    await this.actions.click(this.completePurchasePage.checkoutButton());
    await checkoutYourInformationModule.enterInformation('Jordan', 'Rivera', '94107');
    await checkoutYourInformationModule.continue();
    await checkoutOverviewModule.goto();
  }
}
