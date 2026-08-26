import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'Disclaimer',
    description:
        'Disclaimer for Factor Calculator — the limits of what our free math tools provide and how results should be used.',
    alternates: { canonical: absoluteUrl('/disclaimer/') },
};

const LAST_UPDATED = 'August 26, 2026';

export default function DisclaimerPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/disclaimer/'),
            name: 'Disclaimer',
            description: metadata.description,
            dateModified: nowIso(),
        })
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />
            <main className="container-prose py-4">
                <Breadcrumb items={[{ name: 'Disclaimer', href: '/disclaimer/' }]} />

                <h1>Disclaimer</h1>
                <p className="text-sm text-ink-muted">Last updated: {LAST_UPDATED}</p>

                <h2>Educational use</h2>
                <p>
                    {siteConfig.name} is an educational resource. The calculators and
                    explanations are here to help you learn and check your work — they are
                    not a substitute for understanding the underlying mathematics, and they
                    are not a substitute for instruction from a teacher.
                </p>

                <h2>Accuracy</h2>
                <p>
                    The calculations use standard number theory algorithms and are covered
                    by automated tests that verify results against known values, including
                    published sequences from the OEIS. Considerable care goes into getting
                    them right.
                </p>
                <p>
                    Even so, no software is guaranteed error-free. If a result matters —
                    for an exam, an assignment, or professional work — verify it
                    independently before relying on it. If you find an incorrect result,
                    please <Link href="/contact/">report it</Link>; corrections are made
                    promptly.
                </p>

                <h2>Limits of the calculators</h2>
                <p>
                    The tools on this site work with positive whole numbers. They do not
                    handle:
                </p>
                <ul>
                    <li>Decimals or fractions — factors are defined for integers only</li>
                    <li>
                        Algebraic expressions such as x² − 4 — this site covers number
                        factoring, not polynomial factoring
                    </li>
                    <li>
                        Numbers above one trillion, where browser arithmetic loses precision
                    </li>
                </ul>
                <p>
                    Where a number falls outside these limits, the calculator says so
                    rather than returning a misleading answer.
                </p>

                <h2>No professional advice</h2>
                <p>
                    Nothing on this site constitutes professional, financial, legal, or
                    academic advice. Results are mathematical outputs, nothing more.
                </p>

                <h2>External references</h2>
                <p>
                    Pages link to external references including Wikipedia, Wolfram
                    MathWorld, and the OEIS. These links are provided for further reading.
                    Their content is maintained by others, and we cannot guarantee its
                    accuracy or availability.
                </p>

                <h2>Advertising</h2>
                <p>
                    Advertisements shown on this site are served by third-party networks.
                    Their appearance does not constitute an endorsement, and we are not
                    responsible for the products, services, or claims they contain.
                </p>

                <h2>Availability</h2>
                <p>
                    This site is provided free of charge with no guarantee of continued
                    availability. Features may change or be removed.
                </p>

                <h2>Contact</h2>
                <p>
                    Questions about this disclaimer can be sent to{' '}
                    <strong>{siteConfig.email}</strong>.
                </p>
            </main>
        </>
    );
}