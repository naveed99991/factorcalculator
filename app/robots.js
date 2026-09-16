export const dynamic = 'force-static';

import { siteConfig } from '../lib/siteConfig';

/**
 * robots.txt — explicitly allows AI crawlers alongside search engines.
 *
 * Note on AI crawlers: allowing them is a bet that being cited in AI answers
 * is worth more than the lost click. It is not a Google ranking signal.
 */

const SEARCH_BOTS = ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Slurp', 'Baiduspider', 'YandexBot'];

const AI_BOTS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'anthropic-ai',
    'Claude-Web',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'CCBot',
    'Applebot',
    'Applebot-Extended',
    'Amazonbot',
    'meta-externalagent',
    'FacebookBot',
    'cohere-ai',
    'YouBot',
    'Bytespider',
    'Diffbot',
    'omgili',
];

export default function robots() {
    const allowAll = { allow: '/', disallow: ['/api/'] };

    return {
        rules: [
            { userAgent: '*', ...allowAll },
            ...SEARCH_BOTS.map((bot) => ({ userAgent: bot, ...allowAll })),
            ...AI_BOTS.map((bot) => ({ userAgent: bot, ...allowAll })),
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
        host: siteConfig.url,
    };
}