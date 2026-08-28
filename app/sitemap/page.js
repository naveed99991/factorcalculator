import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'Sitemap — All Pages',
    description:
        'Every page on Factor Calculator: six calculators plus a dedicated factor page for every number from 1 to 1200. Browse by number range.',
    alternates: { canonical: absoluteUrl('/sitemap/') },
};

const MAX_NUMBER = 1200;
const RANGE_SIZE = 100;

export default function SitemapPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/sitemap/'),
            name: 'Sitemap',
            description: metadata.description,
            dateModified: nowIso(),
        })
    );

    const ranges = [];
    for (let start = 1; start <= MAX_NUMBER; start += RANGE_SIZE) {
        const end = Math.min(start + RANGE_SIZE - 1, MAX_NUMBER);
        ranges.push({ start, end });
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />
            <main className="py-4">
                <div className="container-prose">
                    <Breadcrumb items={[{ name: 'Sitemap', href: '/sitemap/' }]} />
                    <h1>Sitemap</h1>
                    <p>
                        Every page on {siteConfig.name}, organized for browsing. There are
                        six calculators plus a dedicated factor page for each number from 1
                        to {MAX_NUMBER}.
                    </p>
                </div>

                <div className="container-prose">
                    <h2>Calculators</h2>
                    <ul>
                        {siteConfig.footer.tools.map((t) => (
                            <li key={t.href}>
                                <Link href={t.href}>{t.label}</Link>
                            </li>
                        ))}
                    </ul>

                    <h2>Site pages</h2>
                    <ul>
                        {[...siteConfig.footer.company, ...siteConfig.footer.legal].map((t) => (
                            <li key={t.href}>
                                <Link href={t.href}>{t.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="container-content">
                    <h2>Factor pages by number</h2>
                    <p className="text-ink-muted">
                        Each page lists all factors, factor pairs, prime factorization, a
                        factor tree, and number properties.
                    </p>

                    {ranges.map((range) => (
                        <NumberRange key={range.start} start={range.start} end={range.end} />
                    ))}
                </div>
            </main>
        </>
    );
}

function NumberRange({ start, end }) {
    const numbers = [];
    for (let i = start; i <= end; i++) numbers.push(i);

    return (
        <details className="mt-4 border border-surface-border rounded-lg overflow-hidden">
            <summary className="cursor-pointer px-4 py-3 bg-surface-soft hover:bg-surface-alt font-semibold text-ink">
                Factors of {start}–{end}
            </summary>
            <ul className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 list-none p-4 m-0">
                {numbers.map((n) => (
                    <li key={n} className="m-0">
                        <Link
                            href={`/factors-of-${n}/`}
                            className="block px-2 py-1.5 text-center text-sm bg-white border border-surface-border rounded no-underline text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                        >
                            {n}
                        </Link>
                    </li>
                ))}
            </ul>
        </details>
    );
}