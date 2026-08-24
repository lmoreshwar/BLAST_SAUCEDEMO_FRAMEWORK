import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { CartPage } from '../pages/CartPage';

/** Cart workflow: review the cart and start checkout. */
export class CartModule {
  private readonly actions: Actions;
  private readonly logger = Logger.create('CartModule');
  private readonly cartPage: CartPage;

  constructor(page: Page) {
    this.actions = new Actions(page);
    this.cartPage = new CartPage(page);
  }

  /** Open the cart and proceed to the checkout information step. */
  async proceedToCheckout(): Promise<void> {
    this.logger.step(1, 'Open the cart and start checkout');
    await this.actions.navigate(urlFor(routes.cart), {
      readyElement: this.cartPage.checkoutButton(),
    });
    await this.actions.click(this.cartPage.checkoutButton());
  }
}
