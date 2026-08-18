import { type Locator, type Page } from '@playwright/test';

export class AdminJobTitlesPage {
    readonly addButton: Locator;
    readonly addJobTitleHeading: Locator;
    readonly jobTitleTextbox: Locator;
    readonly jobDescriptionTextbox: Locator;
    readonly noteTextbox: Locator;
    readonly saveButton: Locator;
    readonly jobTitlesHeading: Locator;
    readonly recordsFoundText: Locator;
    readonly createdJobTitle: (jobTitle: string) => Locator;
    readonly duplicateMessage: Locator;

    constructor(private readonly page: Page) {
        this.addButton = page.getByRole('button', { name: ' Add' });
        this.addJobTitleHeading = page.getByRole('heading', { name: 'Add Job Title', exact: true });
        this.jobTitleTextbox = page.getByText('Job Title', { exact: true }).locator('xpath=ancestor::*[descendant::input or descendant::textarea or descendant::select][1]').getByRole('textbox');
        this.jobDescriptionTextbox = page.getByRole('textbox', { name: 'Type description here' });
        this.noteTextbox = page.getByRole('textbox', { name: 'Add note' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.jobTitlesHeading = page.getByRole('heading', { name: 'Job Titles', exact: true });
        this.recordsFoundText = page.getByText(/\(\d+\) Records Found/);
        this.createdJobTitle = (jobTitle: string) => page.getByText(jobTitle, { exact: true });
        this.duplicateMessage = page.getByText('Already exists', { exact: true });
    }
}
