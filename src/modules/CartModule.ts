import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { InventoryModule } from './InventoryModule';
import { CartPage } from '../pages/CartPage';

export class CartModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('CartModule');
  private readonly inventoryModule: InventoryModule;
  readonly cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.inventoryModule = new InventoryModule(page);
    this.cartPage = new CartPage(page);
  }

  async establishCart(): Promise<void> {
    await this.inventoryModule.addBackpackToCart();
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the cart page');
    await this.actions.navigate(urlFor(routes.cart));
  }
}
