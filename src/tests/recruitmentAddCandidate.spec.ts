import { credentials, routes, urlRegex } from '../config';
import testData from '../testdata/testData.json';
import { test, expect } from '../fixtures';
import { RecruitmentAddCandidateModule } from '../modules/RecruitmentAddCandidateModule';
import { RecruitmentAddCandidatePage } from '../pages/RecruitmentAddCandidatePage';

test.describe('Recruitment Add Candidate', () => {
    test('[TC_001] Valid candidate details create a candidate profile @RecruitmentAddCandidate @Smoke @Regression', async ({
        loginModule,
        page,
    }) => {
        const appCredentials = credentials('app');
        const candidateModule = new RecruitmentAddCandidateModule(page);
        const candidatePage = new RecruitmentAddCandidatePage(page);

        await loginModule.goto();
        await loginModule.login(appCredentials.username, appCredentials.password);
        await candidateModule.goto();
        await candidateModule.addCandidate(
            testData.recruitmentAddCandidate.firstName,
            testData.recruitmentAddCandidate.lastName,
            testData.recruitmentAddCandidate.emailSeed,
        );

        await expect(page).toHaveURL(urlRegex(routes.recruitmentCandidateDetails));
        await expect(candidatePage.candidateName).toBeVisible();
    });
});
