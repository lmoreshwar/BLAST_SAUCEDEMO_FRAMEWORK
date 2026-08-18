import { Locator, Page } from '@playwright/test';
import { ActionTarget, Actions } from './Actions';
import { WaitHelper } from './WaitHelper';
import { TIMEOUTS } from './constants';

export class WorkflowActions {
    private actions: Actions;
    private waitHelper: WaitHelper;

    constructor(private page: Page) {
        this.actions = new Actions(page);
        this.waitHelper = new WaitHelper(page);
    }

    /**
     * Wait until loading indicators are absent for a stable window.
     * Delegates to the shared WaitHelper.waitForLoader so loader-waiting lives
     * in ONE place. Kept for backward compatibility with existing callers.
     */
    async waitForLoadingToStabilize(options?: { timeoutMs?: number; stableWindowMs?: number }) {
        await this.waitHelper.waitForLoader({
            timeout: options?.timeoutMs ?? 45000,
            stableWindowMs: options?.stableWindowMs ?? 2000,
        });
    }

    /**
     * Common step: open hamburger/menu and click target menu item.
     */
    async clickMenuPath(menuTrigger: ActionTarget, menuItem: ActionTarget, options?: { timeout?: number }) {
        const timeout = options?.timeout ?? 10000;
        await this.actions.click(menuTrigger, { timeout });
        await this.waitForLoadingToStabilize({ timeoutMs: timeout * 2, stableWindowMs: 800 });
        await this.actions.click(menuItem, { timeout });
    }

    /**
     * Common step: fill search input and submit by button click or Enter key.
     */
    async searchWithOptionalSubmit(
        inputTarget: ActionTarget,
        value: string,
        submitTarget?: ActionTarget,
        options?: { timeout?: number },
    ) {
        const timeout = options?.timeout ?? 10000;
        await this.actions.fill(inputTarget, value, { timeout, clearFirst: true });

        if (submitTarget) {
            await this.actions.click(submitTarget, { timeout });
        } else {
            await this.actions.pressOn(inputTarget, 'Enter', { timeout });
        }

        await this.waitForLoadingToStabilize({ timeoutMs: timeout * 2, stableWindowMs: 1200 });
    }

    /**
     * Common step: click element and wait for newly opened tab.
     */
    async clickAndWaitForNewTab(clickTarget: ActionTarget, options?: { timeout?: number }) {
        const timeout = options?.timeout ?? 15000;
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout }),
            this.actions.click(clickTarget, { timeout }),
        ]);

        await this.waitHelper.waitForPageLoadState('domcontentloaded', { page: newPage, timeout });
        return newPage;
    }

    /**
     * Common step: open a CUSTOM (non-native) dropdown and choose an option by its visible label.
     * For app widgets that render options only after the trigger is clicked (React/oxd selects,
     * comboboxes) — NOT a native `<select>` (use `Actions.selectOption` for those). Pass the
     * trigger locator (from the Page) and the option text. Reuse this everywhere a dropdown is
     * selected instead of writing bespoke open-then-click code per test.
     */
    async selectDropdownOption(trigger: ActionTarget, optionText: string, options?: { timeout?: number }) {
        const timeout = options?.timeout ?? 10000;
        await this.actions.click(trigger, { timeout });
        // Prefer the accessible option role; fall back to a text match scoped to the open listbox.
        const byRole = this.page.getByRole('option', { name: optionText, exact: true });
        const option = (await byRole.count())
            ? byRole.first()
            : this.page
                .locator('[role="listbox"], .oxd-select-dropdown')
                .getByText(optionText, { exact: true })
                .first();
        await this.actions.click(option, { timeout });
        await this.waitForLoadingToStabilize({ timeoutMs: timeout, stableWindowMs: 400 });
    }

    /**
     * Common step: SEARCHABLE dropdown / autocomplete ("type for hints", async option lists).
     * Type into the input to filter, wait for the loader to settle, then pick the option. Pass
     * `optionText` when the label differs from the typed text; otherwise the typed text is matched.
     */
    async searchAndSelectOption(
        input: ActionTarget,
        searchText: string,
        optionText?: string,
        options?: { timeout?: number },
    ) {
        const timeout = options?.timeout ?? 10000;
        await this.actions.fill(input, searchText, { timeout, clearFirst: true });
        await this.waitForLoadingToStabilize({ timeoutMs: timeout, stableWindowMs: 600 });
        const wanted = optionText ?? searchText;
        const byRole = this.page.getByRole('option', { name: wanted, exact: !!optionText });
        const option = (await byRole.count())
            ? byRole.first()
            : this.page
                .locator('[role="listbox"], .oxd-autocomplete-dropdown, .oxd-select-dropdown')
                .getByText(wanted, { exact: !!optionText })
                .first();
        await this.actions.waitForVisible(option, timeout);
        await this.actions.click(option, { timeout });
    }

    /**
     * Common step: drive a checkbox to a desired state (idempotent). Works for native
     * `<input type=checkbox>` and label-covered custom checkboxes via Playwright's check/uncheck.
     */
    async setCheckbox(target: ActionTarget, checked: boolean, options?: { timeout?: number }) {
        if (checked) await this.actions.check(target, options);
        else await this.actions.uncheck(target, options);
    }

    /**
     * Common step: select a radio option by its visible label (native or custom-styled radios).
     */
    async selectRadioOption(optionLabel: string, options?: { timeout?: number }) {
        const timeout = options?.timeout ?? 10000;
        const target = this.page
            .getByRole('radio', { name: optionLabel })
            .or(this.page.getByText(optionLabel, { exact: true }));
        await this.actions.click(target.first(), { timeout });
    }

    /**
     * Common step: set a date field. For a native `<input type=date>` or a free-text date input,
     * fill the value directly and close any popup. Custom CALENDAR-grid pickers need their own
     * evidence-based day locators — use a Page/Module method for those, not this helper.
     */
    async selectDate(input: ActionTarget, value: string, options?: { timeout?: number }) {
        const timeout = options?.timeout ?? TIMEOUTS.SHORT;
        await this.actions.fill(input, value, { timeout, clearFirst: true });
        await this.actions.pressOn(input, 'Escape', { timeout }).catch(() => undefined);
    }

    /**
     * Common step: READ a cell value from the row that contains `rowText`, by 0-based column index.
     * Uses ARIA row/cell roles so it works across native tables and grid widgets.
     */
    async readTableCell(
        table: ActionTarget,
        rowText: string,
        columnIndex: number,
        options?: { timeout?: number },
    ): Promise<string> {
        const timeout = options?.timeout ?? 10000;
        const row = this.toLocator(table).getByRole('row').filter({ hasText: rowText }).first();
        await row.waitFor({ state: 'visible', timeout });
        return (await row.getByRole('cell').nth(columnIndex).innerText()).trim();
    }

    /**
     * Common step: act on a table ROW — click a button/link/cell (by its label) inside the row
     * that contains `rowText` (e.g. an Edit/Delete/Select control). Row-scoped so it never matches
     * a same-named control in another row (avoids strict-mode failures).
     */
    async clickInRow(
        table: ActionTarget,
        rowText: string,
        controlName: string,
        options?: { timeout?: number },
    ) {
        const timeout = options?.timeout ?? 10000;
        const row = this.toLocator(table).getByRole('row').filter({ hasText: rowText }).first();
        await row.waitFor({ state: 'visible', timeout });
        const control = row
            .getByRole('button', { name: controlName })
            .or(row.getByRole('link', { name: controlName }))
            .or(row.getByText(controlName, { exact: true }));
        await control.first().click({ timeout });
    }

    /**
     * Common step: check/uncheck the checkbox in the table ROW that contains `rowText`
     * (e.g. selecting a record's row before a bulk action).
     */
    async setRowCheckbox(
        table: ActionTarget,
        rowText: string,
        checked: boolean,
        options?: { timeout?: number },
    ) {
        const timeout = options?.timeout ?? 10000;
        const row = this.toLocator(table).getByRole('row').filter({ hasText: rowText }).first();
        await row.waitFor({ state: 'visible', timeout });
        await this.setCheckbox(row.getByRole('checkbox').first(), checked, { timeout });
    }

    /** Resolve an ActionTarget (Locator or selector string) to a Locator. */
    private toLocator(target: ActionTarget): Locator {
        return typeof target === 'string' ? this.page.locator(target) : target;
    }
}