import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { routes, urlFor } from '../config';
import { SideMenuPage } from '../pages/SideMenuPage';

export class SideMenuModule {
  private readonly page: Page;
  private readonly actions: Actions;
  private readonly logger = Logger.create('SideMenuModule');
  private readonly sideMenuPage: SideMenuPage;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.sideMenuPage = new SideMenuPage(page);
  }

  async goto(): Promise<void> {
    this.logger.step(1, 'Open the inventory page');
    await this.actions.navigate(urlFor(routes.inventory), {
      readyElement: this.sideMenuPage.openMenuButton(),
    });
  }

  async logout(): Promise<void> {
    this.logger.step(2, 'Open the side menu');
    await this.actions.click(this.sideMenuPage.openMenuButton());
    this.logger.step(3, 'Log out from the side menu');
    await this.actions.click(this.sideMenuPage.logoutLink());
  }

    public async openMenu(): Promise<void> {
        this.logger.info('Open the side menu');
        await this.actions.click(this.sideMenuPage.openMenuButton());
    }

    public async goBack(): Promise<void> {
        this.logger.info('Navigate back in browser history');
        await this.page.goBack();
    }

    public async attemptRepeatedLogout(): Promise<boolean> {
        this.logger.info('Attempt logout after the session has ended');

        const logoutAvailable: boolean = await this.sideMenuPage.logoutLink().isVisible();
        if (logoutAvailable) {
            await this.actions.click(this.sideMenuPage.logoutLink());
            return true;
        }

        return false;
    }
}
