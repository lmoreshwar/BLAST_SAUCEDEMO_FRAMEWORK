import { type Locator, type Page } from '@playwright/test';

export class RecruitmentAddCandidatePage {
    readonly addCandidateHeading: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly emailTextbox: Locator;
    readonly consentCheckbox: Locator;
    readonly saveButton: Locator;
    readonly candidateName: Locator;

    constructor(private readonly page: Page) {
        this.addCandidateHeading = page.getByRole('heading', { name: 'Add Candidate' });
        this.firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
        this.emailTextbox = page.getByText('Email', { exact: true }).locator('xpath=ancestor::*[descendant::input or descendant::textarea or descendant::select][1]').getByRole('textbox', { name: 'Type here' });
        this.consentCheckbox = page.getByRole('checkbox', { name: '' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.candidateName = page.getByText('Alex Candidate', { exact: true });
    }
}
