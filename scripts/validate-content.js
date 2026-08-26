/**
 * Content validation for the built site.
 *
 * Checks that every page has a unique title and description, that no two pages
 * share identical body content, and that the factor lists shown on number pages
 * match what the math library actually computes.
 *
 * Run after `pnpm build`:  node scripts/validate-content.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app');
const MAX_NUMBER = 1200;

let errors = 0;
let warnings = 0;

function fail(msg) {
    console.error(`  FAIL  ${msg}`);
    errors++;
}

function warn(msg) {
    console.warn(`  WARN  ${msg}`);
    warnings++;
}

function ok(msg) {
    console.log(`  ok    ${msg}`);
}

/** Recursively collect every .html file in the build output. */
function collectHtmlFiles(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectHtmlFiles(full, acc);
        } else if (entry.name.endsWith('.html')) {
            acc.push(full);
        }
    }
    return acc;
}

function extractTag(html, regex) {
    const m = html.match(regex);
    return m ? m[1].trim() : null;
}

function getTitle(html) {
    return extractTag(html, /<title>([\s\S]*?)<\/title>/i);
}

function getDescription(html) {
    return (
        extractTag(html, /<meta name="description" content="([^"]*)"/i) ||
        extractTag(html, /<meta content="([^"]*)" name="description"/i)
    );
}

function getCanonical(html) {
    return extractTag(html, /<link rel="canonical" href="([^"]*)"/i);
}

/** Strip tags so we can hash the visible text only. */
function textOnly(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/* ---------------- math re-implementation for verification ---------------- */
/* Deliberately written separately from lib/factorMath.js — if both agree,
   a bug would have to exist in two independent implementations. */

function factorsBruteForce(n) {
    const out = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) out.push(i);
    }
    return out;
}

function divisorSumBruteForce(n) {
    let s = 0;
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) s += i;
    }
    return s;
}

/* ---------------- checks ---------------- */

console.log('\nContent validation\n' + '='.repeat(50));

const files = collectHtmlFiles(BUILD_DIR);

if (files.length === 0) {
    console.error(
        '\nNo built HTML found. Run `pnpm build` first, then re-run this script.\n'
    );
    process.exit(1);
}

console.log(`\nScanning ${files.length} HTML files...\n`);

const titles = new Map();
const descriptions = new Map();
const bodyHashes = new Map();
const missingCanonical = [];

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(BUILD_DIR, file);

    const title = getTitle(html);
    const desc = getDescription(html);
    const canonical = getCanonical(html);

    if (!title) {
        fail(`${rel}: no <title>`);
    } else {
        if (titles.has(title)) {
            fail(`Duplicate title: "${title}"\n        ${titles.get(title)}\n        ${rel}`);
        } else {
            titles.set(title, rel);
        }
        if (title.length > 60) {
            warn(`Title over 60 chars (${title.length}): ${rel}`);
        }
    }

    if (!desc) {
        warn(`${rel}: no meta description`);
    } else {
        if (descriptions.has(desc)) {
            fail(`Duplicate description in ${rel} and ${descriptions.get(desc)}`);
        } else {
            descriptions.set(desc, rel);
        }
        if (desc.length > 155) {
            warn(`Description over 155 chars (${desc.length}): ${rel}`);
        }
    }

    if (!canonical) {
        missingCanonical.push(rel);
    }

    // Body uniqueness
    const hash = crypto.createHash('sha1').update(textOnly(html)).digest('hex');
    if (bodyHashes.has(hash)) {
        fail(`Identical body content: ${rel} and ${bodyHashes.get(hash)}`);
    } else {
        bodyHashes.set(hash, rel);
    }

    // One h1 per page
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count === 0) {
        fail(`${rel}: no <h1>`);
    } else if (h1Count > 1) {
        fail(`${rel}: ${h1Count} <h1> tags (should be exactly 1)`);
    }
}

console.log('');
ok(`${titles.size} unique titles`);
ok(`${descriptions.size} unique descriptions`);
ok(`${bodyHashes.size} unique page bodies`);

if (missingCanonical.length > 0) {
    fail(`${missingCanonical.length} pages missing canonical tag`);
    missingCanonical.slice(0, 5).forEach((r) => console.error(`        ${r}`));
}

/* ---------------- numeric spot checks ---------------- */

console.log('\nVerifying factor lists against brute-force math...\n');

const SPOT_CHECK = [1, 2, 6, 7, 12, 24, 28, 36, 49, 64, 72, 96, 100, 120, 144, 180, 360, 496, 720, 1000, 1200];
let checked = 0;

for (const n of SPOT_CHECK) {
    const candidates = [
        path.join(BUILD_DIR, `factors-of-${n}.html`),
        path.join(BUILD_DIR, `factors-of-${n}`, 'index.html'),
    ];
    const file = candidates.find((p) => fs.existsSync(p));

    if (!file) {
        warn(`No built page found for /factors-of-${n}/`);
        continue;
    }

    const html = fs.readFileSync(file, 'utf8');
    const text = textOnly(html);
    const expected = factorsBruteForce(n);
    const expectedSum = divisorSumBruteForce(n);

    // Every factor should appear somewhere on the page
    const missing = expected.filter(
        (d) => !new RegExp(`\\b${d}\\b`).test(text)
    );
    if (missing.length > 0) {
        fail(`/factors-of-${n}/ missing factors in output: ${missing.join(', ')}`);
    }

    // The stated count should match
    if (n > 1 && !text.includes(`${expected.length} factors`) && !text.includes(`${expected.length} factor`)) {
        warn(`/factors-of-${n}/ does not state a factor count of ${expected.length}`);
    }

    // Divisor sum should appear
    if (!new RegExp(`\\b${expectedSum}\\b`).test(text)) {
        warn(`/factors-of-${n}/ does not show divisor sum ${expectedSum}`);
    }

    checked++;
}

ok(`${checked} number pages spot-checked against brute-force factors`);

/* ---------------- summary ---------------- */

console.log('\n' + '='.repeat(50));
console.log(`Errors: ${errors}   Warnings: ${warnings}`);

if (errors > 0) {
    console.error('\nContent validation FAILED\n');
    process.exit(1);
}

console.log('\nContent validation passed\n');