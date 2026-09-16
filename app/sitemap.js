export const dynamic = 'force-static';

import { siteConfig } from '../lib/siteConfig';

const MAX_NUMBER = 1200;

/**
 * XML sitemap covering every page.
 * Priorities reflect real importance: homepage highest, then the other
 * calculators, then number pages, then legal pages.
 */
export default function sitemap() {
    const now = new Date();
    const entries = [];

    // Homepage
    entries.push({
        url: `${siteConfig.url}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1.0,
    });

    // Main calculator pages
    const calculators = [
        '/prime-factorization/',
        '/gcf-calculator/',
        '/lcm-calculator/',
        '/common-factors/',
        '/divisors/',
    ];
    for (const path of calculators) {
        entries.push({
            url: `${siteConfig.url}${path}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        });
    }

    // HTML sitemap — an important hub for crawl discovery
    entries.push({
        url: `${siteConfig.url}/sitemap/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
    });

    // Number pages 1..1200
    for (let n = 1; n <= MAX_NUMBER; n++) {
        entries.push({
            url: `${siteConfig.url}/factors-of-${n}/`,
            lastModified: now,
            changeFrequency: 'monthly',
            // Small, commonly searched numbers get a slightly higher priority
            priority: n <= 100 ? 0.8 : n <= 500 ? 0.6 : 0.5,
        });
    }

    // Site + legal pages
    const staticPages = [
        '/about/',
        '/contact/',
        '/privacy-policy/',
        '/terms/',
        '/disclaimer/',
    ];
    for (const path of staticPages) {
        entries.push({
            url: `${siteConfig.url}${path}`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        });
    }

    return entries;
}