export const dynamic = 'force-static';

import { siteConfig } from '../lib/siteConfig';

export default function manifest() {
    return {
        name: `${siteConfig.name} — ${siteConfig.tagline}`,
        short_name: siteConfig.shortName,
        description: siteConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#4F46E5',
        orientation: 'portrait-primary',
        categories: ['education', 'utilities', 'productivity'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}