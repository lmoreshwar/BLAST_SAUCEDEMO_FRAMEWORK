import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { AdminJobTitlesPage } from '../pages/AdminJobTitlesPage';
import { routes, urlFor, urlRegex } from '../config';
import { uniqueValue } from '../utils/UniqueData';

export class AdminJobTitlesModule {
    private readonly actions: Actions;
    private readonly adminJobTitlesPage: AdminJobTitlesPage;
    private readonly logger = Logger.create('AdminJobTitlesModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.adminJobTitlesPage = new AdminJobTitlesPage(page);
    }

    async goto(): Promise<void> {
        this.logger.step(1, 'Open the Job Titles page');
        await this.page.goto(urlFor(routes.adminJobTitles));
        await this.actions.waitForVisible(this.adminJobTitlesPage.jobTitlesHeading);
    }

    async openAddForm(): Promise<void> {
        this.logger.step(2, 'Open the Add Job Title form');
        await this.actions.click(this.adminJobTitlesPage.addButton);
        await this.actions.waitForVisible(this.adminJobTitlesPage.addJobTitleHeading);
    }

    async createJobTitle(seed: string, description: string, note: string): Promise<string> {
        this.logger.step(3, 'Create a unique job title with description and note');
        const jobTitle = uniqueValue(seed, { kind: 'alphanumeric', length: 24 });
        await this.actions.fill(this.adminJobTitlesPage.jobTitleTextbox, jobTitle);
        await this.actions.fill(this.adminJobTitlesPage.jobDescriptionTextbox, description);
        await this.actions.fill(this.adminJobTitlesPage.noteTextbox, note);
        await this.actions.click(this.adminJobTitlesPage.saveButton);
        await this.page.waitForURL(urlRegex(routes.adminJobTitles));
        return jobTitle;
    }
}
