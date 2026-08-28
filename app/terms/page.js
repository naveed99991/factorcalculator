import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'Terms of Use',
    description:
        'The conditions that apply when you use Factor Calculator — permitted use, accuracy of results, content ownership and limitation of liability.',
    alternates: { canonical: absoluteUrl('/terms/') },
};

const LAST_UPDATED = 'August 26, 2026';

export default function TermsPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/terms/'),
            name: 'Terms of Use',
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
                <Breadcrumb items={[{ name: 'Terms of Use', href: '/terms/' }]} />

                <h1>Terms of Use</h1>
                <p className="text-sm text-ink-muted">Last updated: {LAST_UPDATED}</p>

                <p>
                    By using {siteConfig.name} you agree to these terms. If you do not
                    agree with them, please do not use the site.
                </p>

                <h2>Use of the site</h2>
                <p>
                    The calculators and reference pages on this site are free to use for
                    personal, educational, and commercial purposes. No account or payment
                    is required.
                </p>
                <p>You agree not to:</p>
                <ul>
                    <li>
                        Use automated tools to scrape the site at a rate that degrades
                        service for others
                    </li>
                    <li>
                        Attempt to interfere with, disrupt, or gain unauthorized access to
                        the site or its infrastructure
                    </li>
                    <li>
                        Republish substantial portions of the site&apos;s written content as
                        your own
                    </li>
                </ul>

                <h2>Results and accuracy</h2>
                <p>
                    The calculations here use standard, well-established algorithms and are
                    covered by automated tests. Even so, results are provided for
                    informational and educational purposes and should be verified
                    independently before being relied on for anything consequential —
                    academic submissions, financial decisions, or professional work.
                </p>
                <p>
                    See the <Link href="/disclaimer/">disclaimer</Link> for more detail.
                </p>

                <h2>Content ownership</h2>
                <p>
                    The written explanations, page structure, and design on this site are
                    the property of {siteConfig.name}. Mathematical facts themselves —
                    that 12 has six factors, for example — are not owned by anyone and are
                    free for you to use.
                </p>
                <p>
                    You may quote short passages with a link back to the source page. You
                    may not copy entire pages or reproduce the site&apos;s content in bulk.
                </p>

                <h2>Availability</h2>
                <p>
                    The site is provided on an &quot;as is&quot; and &quot;as
                    available&quot; basis. There is no guarantee of uninterrupted access,
                    and the site may be modified, suspended, or discontinued at any time
                    without notice.
                </p>

                <h2>Limitation of liability</h2>
                <p>
                    To the fullest extent permitted by law, {siteConfig.name} is not liable
                    for any loss or damage arising from your use of this site, including
                    any error in the results or any interruption in availability.
                </p>

                <h2>External links</h2>
                <p>
                    This site links to external references such as Wikipedia, Wolfram
                    MathWorld, and the OEIS. Those sites are not under our control, and we
                    are not responsible for their content or availability.
                </p>

                <h2>Advertising</h2>
                <p>
                    This site may display advertising. Advertisements are served by
                    third-party networks and their presence does not imply endorsement of
                    the products or services shown.
                </p>

                <h2>Changes to these terms</h2>
                <p>
                    These terms may be updated from time to time. Continued use of the site
                    after changes are posted means you accept the revised terms.
                </p>

                <h2>Contact</h2>
                <p>
                    Questions about these terms can be sent to{' '}
                    <strong>{siteConfig.email}</strong>.
                </p>
            </main>
        </>
    );
}