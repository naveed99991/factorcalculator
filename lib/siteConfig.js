/**
 * Site-wide configuration.
 * Single source of truth for brand, domain, contact, and SEO defaults.
 */

export const siteConfig = {
  name: 'Factor Calculator',
  shortName: 'FactorCalculator',
  tagline: 'Find factors, prime factorization, GCF, LCM, and more',
  description:
    'Free online Factor Calculator. Find all factors of any number with step-by-step working, prime factorization, factor pairs, factor tree, GCF, LCM, and more.',

  domain: 'factorcalculator.org',
  url: 'https://factorcalculator.org',
  ogImage: 'https://factorcalculator.org/og-default.png',

  email: 'contact@factorcalculator.org',

  locale: 'en_US',
  language: 'en',

  publisher: {
    name: 'Factor Calculator',
    url: 'https://factorcalculator.org',
    logo: 'https://factorcalculator.org/logo.png',
  },

  author: {
    name: 'Naveed Nazeer',
    url: 'https://factorcalculator.org/about/',
  },

  social: {
    twitter: '',
    github: '',
  },

  nav: [
    { label: 'Factor Calculator',    href: '/' },
    { label: 'Prime Factorization',  href: '/prime-factorization/' },
    { label: 'GCF',                  href: '/gcf-calculator/' },
    { label: 'LCM',                  href: '/lcm-calculator/' },
    { label: 'Common Factors',       href: '/common-factors/' },
    { label: 'Divisors',             href: '/divisors/' },
  ],

  footer: {
    tools: [
      { label: 'Factor Calculator',   href: '/' },
      { label: 'Prime Factorization', href: '/prime-factorization/' },
      { label: 'GCF Calculator',      href: '/gcf-calculator/' },
      { label: 'LCM Calculator',      href: '/lcm-calculator/' },
      { label: 'Common Factors',      href: '/common-factors/' },
      { label: 'Divisor Calculator',  href: '/divisors/' },
    ],
    company: [
      { label: 'About',           href: '/about/' },
      { label: 'Contact',         href: '/contact/' },
      { label: 'Sitemap',         href: '/sitemap/' },
    ],
    legal: [
      { label: 'Privacy Policy',  href: '/privacy-policy/' },
      { label: 'Terms of Use',    href: '/terms/' },
      { label: 'Disclaimer',      href: '/disclaimer/' },
    ],
  },

  popularNumbers: [
    12, 15, 16, 18, 20, 24, 25, 27, 28, 30,
    32, 36, 40, 42, 45, 48, 50, 54, 56, 60,
    64, 72, 75, 80, 84, 90, 96, 100, 108, 120,
    128, 144, 150, 180, 200, 240, 300, 360, 720, 1000,
  ],

  limits: {
    maxNumber: 1000000000000,
  },

  ads: {
    enabled: false,
    publisherId: '',
  },
};

export function absoluteUrl(path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${clean}`;
}

export function nowIso(date = new Date()) {
  return date.toISOString();
}
