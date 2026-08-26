import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

/**
 * Sticky site header with logo + primary nav.
 * Mobile: collapses to hamburger (details/summary — no JS needed).
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border">
      <div className="container-content flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline group"
          aria-label={`${siteConfig.name} — home`}
        >
          <span
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600
                       text-white font-bold text-lg group-hover:bg-brand-700 transition-colors"
            aria-hidden="true"
          >
            ƒ
          </span>
          <span className="font-bold text-ink text-lg tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-ink-soft
                         hover:text-brand-600 hover:bg-brand-50 no-underline transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav — details/summary pattern, zero JS */}
        <details className="md:hidden relative">
          <summary
            className="list-none flex items-center justify-center w-10 h-10 rounded-md
                       hover:bg-surface-alt cursor-pointer"
            aria-label="Open menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7"  x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-surface-border
                       rounded-lg shadow-lg py-2"
            aria-label="Primary mobile"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-sm text-ink-soft hover:text-brand-600
                           hover:bg-brand-50 no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
