import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { credentials } from '../config';
import testData from '../testdata/testData.json';

test.describe('Login', () => {
    test('TC_001 @Login @Smoke @Regression Login with valid credentials', async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(credentials('app').username, credentials('app').password);

        await expect(page).toHaveURL(/\/inventory\.html$/);
    });

    test('TC_003 @Login @Regression Login with invalid username', async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(testData.login.invalidUsername, credentials('app').password);

        await expect(page).toHaveURL(/\/$/);
    });

    test('TC_004 @Login @Regression Login with invalid password', async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(testData.login.standardUsername, testData.login.invalidPassword);

        await expect(page).toHaveURL(/\/$/);
    });

    test('TC_005 @Login @Regression Login with both username and password invalid', async ({ loginModule, page }) => {
        await loginModule.goto();
        await loginModule.login(testData.login.invalidUsername, testData.login.invalidPassword);

        await expect(page).toHaveURL(/\/$/);
    });
});
