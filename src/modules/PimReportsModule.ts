import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { PimReportsPage } from '../pages/PimReportsPage';
import { routes, urlFor } from '../config';

export class PimReportsModule {
    private readonly actions: Actions;
    private readonly pimReportsPage: PimReportsPage;
    private readonly logger = Logger.create('PimReportsModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.pimReportsPage = new PimReportsPage(page);
    }

    async goto(): Promise<void> {
        this.logger.step(1, 'Open the PIM reports page');
        await this.actions.navigate(urlFor(routes.pimReports), {
            readyElement: this.pimReportsPage.reportNameTextbox,
            readyName: 'report name textbox',
        });
    }

    async searchReport(reportName: string): Promise<void> {
        this.logger.step(2, 'Search for an employee report');
        await this.actions.fill(this.pimReportsPage.reportNameTextbox, reportName);
        await this.actions.click(this.pimReportsPage.searchButton);
    }

    async resetSearch(): Promise<void> {
        this.logger.step(3, 'Reset the employee report search');
        await this.actions.click(this.pimReportsPage.resetButton);
    }
}
