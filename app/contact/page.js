import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'Contact',
    description:
        'Report an error, suggest a calculator, or ask a question about any of our free math tools. Corrections to calculations get priority.',
    alternates: { canonical: absoluteUrl('/contact/') },
};

export default function ContactPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/contact/'),
            name: 'Contact Factor Calculator',
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
                <Breadcrumb items={[{ name: 'Contact', href: '/contact/' }]} />

                <h1>Contact</h1>

                <p>
                    Questions, corrections, and suggestions are all welcome. The best way
                    to reach me is by email.
                </p>

                <div className="my-6 p-5 bg-brand-50 border-2 border-brand-200 rounded-xl">
                    <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider m-0">
                        Email
                    </p>
                    <p className="mt-1 mb-0 text-lg font-bold text-ink break-all">
                        {siteConfig.email}
                    </p>
                </div>

                <h2>What to include</h2>
                <p>
                    To help me respond quickly, please include as much of the following as
                    applies:
                </p>
                <ul>
                    <li>
                        <strong>Reporting an error?</strong> Tell me the page URL and the
                        number you entered, plus what result you expected.
                    </li>
                    <li>
                        <strong>Suggesting a calculator?</strong> Describe what it should do
                        and what you would use it for.
                    </li>
                    <li>
                        <strong>Reporting a display problem?</strong> Let me know your device
                        and browser, and a screenshot if you can.
                    </li>
                </ul>

                <h2>Response time</h2>
                <p>
                    I read every message and usually reply within a few days. Reports of
                    incorrect calculations get priority — mathematical accuracy matters
                    more than anything else on this site.
                </p>

                <h2>Before you write</h2>
                <p>
                    Many common questions are already answered on the calculator pages
                    themselves. Each one has a FAQ section covering the method, edge cases,
                    and the mathematics behind the result. The{' '}
                    <Link href="/about/">about page</Link> explains how the site works and
                    where the calculations come from.
                </p>
            </main>
        </>
    );
}