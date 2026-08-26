import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

export default function Footer() {
    const year = new Date().getFullYear();
    const { tools, company, legal } = siteConfig.footer;
    const popular = siteConfig.popularNumbers.slice(0, 16);

    return (
        <footer className="mt-16 border-t border-surface-border bg-surface-soft">
            <div className="container-content py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    <div>
                        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mt-0 mb-3">
                            Calculators
                        </h3>
                        <ul className="space-y-2 list-none pl-0">
                            {tools.map((item) => (
                                <li key={item.href} className="m-0">
                                    <Link
                                        href={item.href}
                                        className="text-sm text-ink-soft hover:text-brand-600 no-underline"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mt-0 mb-3">
                            Popular Numbers
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 list-none pl-0">
                            {popular.map((n) => (
                                <li key={n} className="m-0">
                                    <Link
                                        href={`/factors-of-${n}/`}
                                        className="text-sm text-ink-soft hover:text-brand-600 no-underline"
                                    >
                                        Factors of {n}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mt-0 mb-3">
                            Site
                        </h3>
                        <ul className="space-y-2 list-none pl-0">
                            {company.map((item) => (
                                <li key={item.href} className="m-0">
                                    <Link
                                        href={item.href}
                                        className="text-sm text-ink-soft hover:text-brand-600 no-underline"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mt-0 mb-3">
                            Legal
                        </h3>
                        <ul className="space-y-2 list-none pl-0">
                            {legal.map((item) => (
                                <li key={item.href} className="m-0">
                                    <Link
                                        href={item.href}
                                        className="text-sm text-ink-soft hover:text-brand-600 no-underline"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <Link
                                href={`mailto:${siteConfig.email}`}
                                className="text-sm text-ink-soft hover:text-brand-600 no-underline break-all"
                            >
                                {siteConfig.email}
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-ink-muted m-0">
                        © {year} {siteConfig.name}. All rights reserved.
                    </p>
                    <p className="text-xs text-ink-muted m-0">
                        Free online math tools for students, teachers, and learners.
                    </p>
                </div>
            </div>
        </footer>
    );
}