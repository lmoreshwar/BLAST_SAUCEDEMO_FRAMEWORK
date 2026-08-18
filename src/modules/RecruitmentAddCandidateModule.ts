import { type Page } from '@playwright/test';
import { Actions } from '../utils/Actions';
import { Logger } from '../utils/Logger';
import { RecruitmentAddCandidatePage } from '../pages/RecruitmentAddCandidatePage';
import { routes, urlFor, urlRegex } from '../config';
import { uniqueValue } from '../utils/UniqueData';

export class RecruitmentAddCandidateModule {
    private readonly actions: Actions;
    private readonly candidatePage: RecruitmentAddCandidatePage;
    private readonly logger = Logger.create('RecruitmentAddCandidateModule');

    constructor(private readonly page: Page) {
        this.actions = new Actions(page);
        this.candidatePage = new RecruitmentAddCandidatePage(page);
    }

    async goto(): Promise<void> {
        this.logger.step(1, 'Open the Add Candidate page');
        await this.page.goto(urlFor(routes.recruitmentAddCandidate));
        await this.actions.waitForVisible(this.candidatePage.addCandidateHeading);
    }

    async addCandidate(firstName: string, lastName: string, emailSeed: string): Promise<void> {
        this.logger.step(2, 'Enter candidate details and save the candidate');
        await this.actions.fill(this.candidatePage.firstNameTextbox, firstName);
        await this.actions.fill(this.candidatePage.lastNameTextbox, lastName);
        await this.actions.fill(this.candidatePage.emailTextbox, uniqueValue(emailSeed, { kind: 'email' }));
        await this.actions.check(this.candidatePage.consentCheckbox);
        await this.actions.click(this.candidatePage.saveButton);
        await this.page.waitForURL(urlRegex(routes.recruitmentCandidateDetails));
    }
}
