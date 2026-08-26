/**
 * JSON-LD schema helpers.
 * Each function returns a plain object ready to be JSON.stringify'd
 * into a <script type="application/ld+json"> tag.
 *
 * Only include schemas when they are genuinely applicable to the page.
 * Do not add schema markup just for SEO signal.
 */

import { siteConfig, absoluteUrl, nowIso } from './siteConfig';

/* ---------------- Site-wide schemas ---------------- */

/**
 * Organization — site-wide, goes in root layout.
 * Represents the publisher entity behind the site.
 */
export function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.publisher.name,
    url: siteConfig.publisher.url,
    logo: {
      '@type': 'ImageObject',
      url: siteConfig.publisher.logo,
      width: 512,
      height: 512,
    },
    email: siteConfig.email,
    areaServed: 'Worldwide',
  };
}

/**
 * WebSite — site-wide, goes in root layout.
 * Enables sitelinks searchbox eligibility.
 */
export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: siteConfig.language,
  };
}

/* ---------------- Per-page schemas ---------------- */

/**
 * WebPage — per page.
 * @param {Object} opts
 * @param {string} opts.url        — canonical URL (absolute)
 * @param {string} opts.name       — page title
 * @param {string} opts.description
 * @param {string} [opts.dateModified] — ISO date; defaults to build time
 * @param {string} [opts.datePublished] — ISO date
 */
export function buildWebPage({ url, name, description, dateModified, datePublished }) {
  const modified = dateModified || nowIso();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: siteConfig.language,
    dateModified: modified,
    ...(datePublished && { datePublished }),
  };
}

/**
 * BreadcrumbList — every page except home.
 * @param {Array<{name:string, url:string}>} items — ordered breadcrumb trail
 */
export function buildBreadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage — only use when the page has 3+ real FAQs with self-contained answers.
 * Do NOT invent FAQs to add this schema.
 * @param {Array<{question:string, answer:string}>} faqs
 */
export function buildFAQPage(faqs) {
  if (!Array.isArray(faqs) || faqs.length < 3) {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * HowTo — only use when the page teaches a genuine step-by-step method.
 * Each step should have a name and text; anchor IDs help deep linking.
 * @param {Object} opts
 * @param {string} opts.name
 * @param {string} opts.description
 * @param {Array<{name:string, text:string, id?:string}>} opts.steps
 * @param {string} [opts.totalTime] — ISO 8601 duration, e.g. "PT2M"
 */
export function buildHowTo({ name, description, steps, totalTime }) {
  if (!Array.isArray(steps) || steps.length < 2) {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.id && { url: `#${s.id}` }),
    })),
  };
}

/**
 * SoftwareApplication — for calculator pages themselves.
 * @param {Object} opts
 * @param {string} opts.name        — e.g. "Factor Calculator"
 * @param {string} opts.url         — canonical URL
 * @param {string} opts.description
 * @param {string} [opts.applicationCategory] — defaults to EducationalApplication
 */
export function buildSoftwareApplication({
  name,
  url,
  description,
  applicationCategory = 'EducationalApplication',
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    description,
    applicationCategory,
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': `${siteConfig.url}/#organization` },
  };
}

/* ---------------- Convenience helpers ---------------- */

/**
 * Build a full array of schemas for a standard content page.
 * Filters out null entries so callers can pass optional schemas safely.
 */
export function buildSchemaGraph(...schemas) {
  const clean = schemas.filter(Boolean);
  if (clean.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': clean.map((s) => {
      // strip @context from nested items — @graph provides it
      const { '@context': _ctx, ...rest } = s;
      return rest;
    }),
  };
}

/**
 * Serialize schema for injection into a Next.js <script> tag.
 * Escapes `</script>` to prevent breakage if content contains it.
 */
export function serializeSchema(schema) {
  if (!schema) return '';
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

/* ---------------- Homepage breadcrumb builder ---------------- */

/**
 * Standard breadcrumbs. Every page can build its trail from these.
 */
export const BREADCRUMB_HOME = {
  name: 'Home',
  url: absoluteUrl('/'),
};
