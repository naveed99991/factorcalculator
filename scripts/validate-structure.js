/**
 * Structure validation for the built site.
 *
 * Checks that internal links resolve, JSON-LD parses and has the expected
 * types, images have alt text, and the sitemap covers every built page.
 *
 * Run after `pnpm build`:  node scripts/validate-structure.js
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app');

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

/** Turn a built file path into the route it serves. */
function fileToRoute(file) {
    let rel = path.relative(BUILD_DIR, file).replace(/\\/g, '/');
    rel = rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return rel === '' || rel === 'index' ? '/' : `/${rel}/`;
}

console.log('\nStructure validation\n' + '='.repeat(50));

const files = collectHtmlFiles(BUILD_DIR);

if (files.length === 0) {
    console.error('\nNo built HTML found. Run `pnpm build` first.\n');
    process.exit(1);
}

// Build the set of routes that actually exist
const routes = new Set();
for (const file of files) {
    routes.add(fileToRoute(file));
}
// Routes served from public/
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
    for (const f of fs.readdirSync(publicDir)) {
        routes.add(`/${f}`);
    }
}

console.log(`\nScanning ${files.length} HTML files across ${routes.size} routes...\n`);

/* ---------------- internal links ---------------- */

const brokenLinks = new Map();
let totalInternalLinks = 0;

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = fileToRoute(file);

    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);

    for (const href of hrefs) {
        totalInternalLinks++;

        // Normalize: ensure trailing slash for page routes
        let target = href;
        if (!target.includes('.') && !target.endsWith('/')) {
            target = `${target}/`;
        }

        // Known non-page routes
        if (
            target === '/sitemap.xml' ||
            target === '/robots.txt' ||
            target === '/manifest.webmanifest' ||
            target.startsWith('/_next/')
        ) {
            continue;
        }

        if (!routes.has(target)) {
            if (!brokenLinks.has(target)) brokenLinks.set(target, new Set());
            brokenLinks.get(target).add(rel);
        }
    }
}

if (brokenLinks.size > 0) {
    fail(`${brokenLinks.size} broken internal link targets`);
    let shown = 0;
    for (const [target, sources] of brokenLinks) {
        if (shown >= 10) {
            console.error(`        ... and ${brokenLinks.size - shown} more`);
            break;
        }
        const src = [...sources].slice(0, 2).join(', ');
        console.error(`        ${target}  (linked from ${src})`);
        shown++;
    }
} else {
    ok(`All ${totalInternalLinks} internal links resolve`);
}

/* ---------------- JSON-LD ---------------- */

const schemaTypes = new Map();
let schemaBlocks = 0;
let invalidSchema = 0;

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = fileToRoute(file);

    const blocks = [
        ...html.matchAll(
            /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
        ),
    ].map((m) => m[1]);

    if (blocks.length === 0) {
        warn(`${rel}: no JSON-LD`);
        continue;
    }

    for (const raw of blocks) {
        schemaBlocks++;
        try {
            const decoded = raw.replace(/\\u003c/g, '<');
            const parsed = JSON.parse(decoded);
            const items = parsed['@graph'] || [parsed];
            for (const item of items) {
                const t = item['@type'];
                if (!t) {
                    fail(`${rel}: JSON-LD item without @type`);
                    continue;
                }
                schemaTypes.set(t, (schemaTypes.get(t) || 0) + 1);
            }
        } catch (e) {
            invalidSchema++;
            fail(`${rel}: JSON-LD does not parse — ${e.message}`);
        }
    }
}

if (invalidSchema === 0) {
    ok(`${schemaBlocks} JSON-LD blocks parse cleanly`);
}

console.log('\n  Schema types found:');
for (const [type, count] of [...schemaTypes].sort((a, b) => b[1] - a[1])) {
    console.log(`        ${type.padEnd(24)} ${count}`);
}

/* ---------------- images ---------------- */

let imagesWithoutAlt = 0;
for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const imgs = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
        if (!/\salt=/.test(img)) {
            imagesWithoutAlt++;
            if (imagesWithoutAlt <= 3) {
                fail(`${fileToRoute(file)}: <img> without alt`);
            }
        }
    }
}
if (imagesWithoutAlt === 0) {
    ok('All images have alt attributes');
}

/* ---------------- sitemap coverage ---------------- */

console.log('');
const sitemapCandidates = [
    path.join(BUILD_DIR, 'sitemap.xml.body'),
    path.join(BUILD_DIR, 'sitemap.xml', 'index.html'),
];
const sitemapFile = sitemapCandidates.find((p) => fs.existsSync(p));

if (!sitemapFile) {
    warn('Could not locate built sitemap.xml to verify coverage');
} else {
    const xml = fs.readFileSync(sitemapFile, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    ok(`sitemap.xml contains ${locs.length} URLs`);

    const sitemapPaths = new Set(
        locs.map((u) => {
            try {
                return new URL(u).pathname;
            } catch {
                return u;
            }
        })
    );

    const pageRoutes = [...routes].filter(
        (r) => !r.includes('.') && r !== '/_not-found/'
    );
    const notInSitemap = pageRoutes.filter((r) => !sitemapPaths.has(r));

    if (notInSitemap.length > 0) {
        warn(`${notInSitemap.length} routes not listed in sitemap.xml`);
        notInSitemap.slice(0, 5).forEach((r) => console.warn(`        ${r}`));
    } else {
        ok('Every page route appears in sitemap.xml');
    }
}

/* ---------------- orphan check ---------------- */

console.log('');
const linkedTargets = new Set();
for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        let t = m[1];
        if (!t.includes('.') && !t.endsWith('/')) t = `${t}/`;
        linkedTargets.add(t);
    }
}

const pageRoutes = [...routes].filter(
    (r) => !r.includes('.') && r !== '/_not-found/' && r !== '/'
);
const orphans = pageRoutes.filter((r) => !linkedTargets.has(r));

if (orphans.length > 0) {
    warn(`${orphans.length} pages are not linked from anywhere (orphans)`);
    orphans.slice(0, 5).forEach((r) => console.warn(`        ${r}`));
} else {
    ok('No orphan pages — every page is linked from at least one other page');
}

/* ---------------- summary ---------------- */

console.log('\n' + '='.repeat(50));
console.log(`Errors: ${errors}   Warnings: ${warnings}`);

if (errors > 0) {
    console.error('\nStructure validation FAILED\n');
    process.exit(1);
}

console.log('\nStructure validation passed\n');