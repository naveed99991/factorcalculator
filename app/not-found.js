import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="container-prose py-16 sm:py-24 text-center">
      <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
        404
      </p>
      <h1 className="mt-3">Page not found</h1>
      <p className="mt-3 text-ink-muted">
        The page you were looking for does not exist. Try one of our calculators
        below, or return to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Go to Factor Calculator
        </Link>
        <Link href="/sitemap/" className="btn btn-secondary">
          Browse all pages
        </Link>
      </div>

      <div className="mt-12 text-left">
        <h2 className="text-xl">Popular calculators</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 not-prose">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
