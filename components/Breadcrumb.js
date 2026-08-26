import Link from 'next/link';
import { buildBreadcrumbList, serializeSchema } from '../lib/schema';
import { absoluteUrl } from '../lib/siteConfig';

/**
 * Breadcrumb — visual trail + JSON-LD BreadcrumbList schema.
 *
 * @param {Object} props
 * @param {Array<{name: string, href: string}>} props.items
 *   The trail, EXCLUDING "Home" (auto-prepended). Last item shown as current page.
 *   Example: [{ name: 'Factors', href: '/factors/' }, { name: 'Factors of 72', href: '/factors-of-72/' }]
 */
export default function Breadcrumb({ items = [] }) {
  const trail = [{ name: 'Home', href: '/' }, ...items];

  // JSON-LD BreadcrumbList — use absolute URLs
  const schema = buildBreadcrumbList(
    trail.map((item) => ({
      name: item.name,
      url: absoluteUrl(item.href),
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm mb-4 mt-2">
        <ol className="flex flex-wrap items-center gap-1 list-none pl-0 m-0">
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center m-0">
                {i > 0 && (
                  <span
                    className="mx-1.5 text-ink-faint select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
                {isLast ? (
                  <span
                    className="text-ink-muted"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-ink-soft hover:text-brand-600 no-underline"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
