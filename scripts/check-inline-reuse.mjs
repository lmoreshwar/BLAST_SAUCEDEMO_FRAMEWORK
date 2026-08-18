#!/usr/bin/env node
/**
 * Reuse advisory (WARN-ONLY, never blocks).
 *
 * Flags interaction-heavy code written directly inline in a Spec, Page, or Module
 * that duplicates a pattern ALREADY available as a method on WorkflowActions.ts.
 * The shared helpers are the single source of truth for these interactions — a new
 * test should CALL the helper (or, on the Copilot path, add a new generic helper to
 * WorkflowActions.ts) instead of re-implementing the open-then-click / row-scope /
 * new-tab / sleep logic by hand.
 *
 * Why warn-only: the cloud codegen path emits a fixed JSON schema and cannot create
 * a new helper file, so a hard failure there would be un-actionable by the generator.
 * This advisory makes the missed reuse VISIBLE in the CI log (GitHub `::warning`
 * annotations) without failing the build. On the Copilot-handoff path the fix is to
 * promote the flagged interaction into WorkflowActions.ts and call it.
 *
 * Curated, high-signal rule list only — tuned to produce ZERO findings on clean,
 * wrapper-driven code (Modules using `this.actions.*`, Pages that are locators-only).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const IS_CI = process.env.GITHUB_ACTIONS === 'true';

// Only scan the layers that must stay lean. utils/ (where the helpers LIVE) is excluded.
const SCAN_DIRS = [
    { dir: join('src', 'tests'), layer: 'tests' },
    { dir: join('src', 'pages'), layer: 'pages' },
    { dir: join('src', 'modules'), layer: 'modules' },
];

/**
 * Each rule maps an inline anti-pattern to the existing helper that already covers it.
 * `layers` limits where the rule applies. Lines that are comments or assertions are skipped.
 */
const RULES = [
    {
        id: 'raw-sleep',
        pattern: /\.waitForTimeout\s*\(/,
        layers: ['tests', 'pages', 'modules'],
        helper: 'WaitHelper.waitForLoader / WorkflowActions.waitForLoadingToStabilize',
        message:
            'Raw waitForTimeout() — fixed sleeps are banned. Use WaitHelper/waitForLoadingToStabilize().',
    },
    {
        id: 'custom-dropdown-option',
        pattern: /getByRole\(\s*['"]option['"]/,
        layers: ['tests', 'pages', 'modules'],
        helper: 'WorkflowActions.selectDropdownOption / searchAndSelectOption',
        message:
            "Inline custom-dropdown open (getByRole('option')) — reuse selectDropdownOption()/searchAndSelectOption() instead of bespoke open-then-click code.",
    },
    {
        id: 'dropdown-internals',
        pattern: /\[role=["']listbox["']\]|oxd-select-dropdown|oxd-autocomplete-dropdown/,
        layers: ['tests', 'pages', 'modules'],
        helper: 'WorkflowActions.selectDropdownOption / searchAndSelectOption',
        message:
            'Inline dropdown-internals selector — reuse selectDropdownOption()/searchAndSelectOption().',
    },
    {
        id: 'new-tab',
        pattern: /waitForEvent\(\s*['"]page['"]/,
        layers: ['tests', 'pages', 'modules'],
        helper: 'WorkflowActions.clickAndWaitForNewTab',
        message: "Inline new-tab handling (waitForEvent('page')) — reuse clickAndWaitForNewTab().",
    },
    {
        id: 'row-scope',
        pattern: /getByRole\(\s*['"]row['"]\s*\)\s*\.filter\s*\(/,
        layers: ['tests', 'pages', 'modules'],
        helper: 'WorkflowActions.readTableCell / clickInRow / setRowCheckbox',
        message:
            "Inline table-row scoping (getByRole('row').filter(...)) — reuse readTableCell()/clickInRow()/setRowCheckbox().",
    },
    {
        id: 'radio-inline',
        pattern: /getByRole\(\s*['"]radio['"]/,
        layers: ['tests', 'modules'],
        helper: 'WorkflowActions.selectRadioOption',
        message: "Inline radio selection (getByRole('radio')) — reuse selectRadioOption().",
    },
    {
        id: 'page-interaction',
        pattern: /\.(click|fill|check|uncheck|selectOption|setChecked|dblclick|hover|press|type)\s*\(/,
        layers: ['pages'],
        helper: '(move the action into a Module)',
        message:
            'Interaction verb in a Page — Pages must be LOCATORS ONLY. Move the action to a Module (drive it via Actions/WorkflowActions there).',
    },
];

/** True for lines that are comments or pure assertions (not interaction code). */
function shouldSkipLine(line) {
    const t = line.trim();
    if (t === '' || t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return true;
    // Assertions reference locators but do not perform the interaction the helper owns.
    if (t.startsWith('expect(') || t.includes('await expect(')) return true;
    return false;
}

function listTsFiles(absDir) {
    const out = [];
    if (!existsSync(absDir)) return out;
    for (const entry of readdirSync(absDir)) {
        const p = join(absDir, entry);
        const s = statSync(p);
        if (s.isDirectory()) out.push(...listTsFiles(p));
        else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) out.push(p);
    }
    return out;
}

const findings = [];

for (const { dir, layer } of SCAN_DIRS) {
    const absDir = join(ROOT, dir);
    for (const file of listTsFiles(absDir)) {
        const rel = relative(ROOT, file).split(sep).join('/');
        const lines = readFileSync(file, 'utf8').split(/\r?\n/);
        lines.forEach((line, idx) => {
            if (shouldSkipLine(line)) return;
            for (const rule of RULES) {
                if (!rule.layers.includes(layer)) continue;
                if (rule.pattern.test(line)) {
                    findings.push({
                        file: rel,
                        line: idx + 1,
                        ruleId: rule.id,
                        helper: rule.helper,
                        message: rule.message,
                    });
                }
            }
        });
    }
}

const title = 'Reuse advisory (warn-only)';

if (findings.length === 0) {
    console.log(`\n✅ ${title}: no inline duplications of WorkflowActions helpers detected.\n`);
    process.exit(0);
}

console.log(
    `\n⚠️  ${title}: ${findings.length} potential inline-duplication(s). These are NON-BLOCKING hints — prefer the shared helper (or promote a new one into WorkflowActions.ts on the Copilot path).\n`,
);

for (const f of findings) {
    if (IS_CI) {
        // GitHub Actions annotation — surfaces in the run summary AND the log, never fails the job.
        console.log(
            `::warning file=${f.file},line=${f.line},title=Reuse advisory [${f.ruleId}]::${f.message} → ${f.helper}`,
        );
    } else {
        console.log(`  ${f.file}:${f.line}  [${f.ruleId}]`);
        console.log(`    ${f.message}`);
        console.log(`    ↳ reuse: ${f.helper}\n`);
    }
}

// Always exit 0 — this is an advisory, not a gate.
process.exit(0);
