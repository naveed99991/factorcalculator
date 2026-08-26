import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'Privacy Policy',
    description:
        'Privacy Policy for Factor Calculator — what data we collect, how cookies and analytics are used, and your rights over your information.',
    alternates: { canonical: absoluteUrl('/privacy-policy/') },
};

const LAST_UPDATED = 'August 26, 2026';

const OPT_OUT_LINKS = [
    {
        url: 'https://tools.google.com/dlpage/gaoptout',
        label: 'Google Analytics opt-out browser add-on',
        note: 'Stops Google Analytics from collecting your visit data.',
    },
    {
        url: 'https://www.google.com/settings/ads',
        label: 'Google Ads Settings',
        note: 'Turn off personalized advertising from Google.',
    },
    {
        url: 'https://www.aboutads.info/choices/',
        label: 'aboutads.info — Digital Advertising Alliance',
        note: 'Opt out of third-party vendor advertising cookies.',
    },
];

export default function PrivacyPolicyPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/privacy-policy/'),
            name: 'Privacy Policy',
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
                <Breadcrumb items={[{ name: 'Privacy Policy', href: '/privacy-policy/' }]} />

                <h1>Privacy Policy</h1>
                <p className="text-sm text-ink-muted">Last updated: {LAST_UPDATED}</p>

                <p>
                    This policy explains what information {siteConfig.name} collects when
                    you use this website, how it is used, and what choices you have.
                </p>

                <h2>Calculator inputs are not collected</h2>
                <p>
                    Every calculation on this site runs entirely in your browser. The
                    numbers you type are never sent to a server, never logged, and never
                    stored. Closing the tab removes them completely.
                </p>

                <h2>Information collected automatically</h2>
                <p>
                    Like most websites, basic technical information may be recorded when
                    you visit:
                </p>
                <ul>
                    <li>Browser type and version</li>
                    <li>Device type and screen size</li>
                    <li>Approximate location (country or region level)</li>
                    <li>Pages visited and time spent</li>
                    <li>The site you arrived from</li>
                </ul>
                <p>
                    This information is aggregated and is not used to identify individual
                    visitors.
                </p>

                <h2>Cookies</h2>
                <p>
                    Cookies are small text files stored by your browser. This site may use
                    them for:
                </p>
                <ul>
                    <li>
                        <strong>Analytics</strong> — understanding which pages are useful and
                        where visitors have trouble
                    </li>
                    <li>
                        <strong>Advertising</strong> — if advertising is enabled, ad partners
                        may use cookies to show relevant ads
                    </li>
                </ul>
                <p>
                    You can block or delete cookies through your browser settings. The
                    calculators work normally with cookies disabled.
                </p>

                <h2>Analytics</h2>
                <p>
                    This site may use Google Analytics to understand aggregate traffic
                    patterns, such as which pages are visited and how long sessions last.
                    Google Analytics does not receive the numbers you enter into any
                    calculator.
                </p>

                <h2>Advertising</h2>
                <p>
                    This site may display advertising served by Google AdSense or similar
                    networks. Third-party vendors, including Google, use cookies to serve
                    ads based on your prior visits to this and other websites.
                </p>

                <h2>How to opt out</h2>
                <p>
                    You can limit analytics and personalized advertising using the
                    following official tools:
                </p>
                <ul>
                    {OPT_OUT_LINKS.map((item) => (
                        <li key={item.url}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.label}
                            </a>
                            {' — '}
                            {item.note}
                        </li>
                    ))}
                </ul>

                <h2>Third-party links</h2>
                <p>
                    Some pages link to external references such as Wikipedia, Wolfram
                    MathWorld, and the OEIS. Those sites have their own privacy policies,
                    and this policy does not cover them.
                </p>

                <h2>Children&apos;s privacy</h2>
                <p>
                    This site is designed for general educational use and does not
                    knowingly collect personal information from children under 13. No
                    account, sign-up, or personal detail is required to use any calculator.
                </p>

                <h2>Your rights</h2>
                <p>
                    Depending on where you live, you may have the right to access, correct,
                    or delete personal information held about you, and to object to certain
                    processing. Because this site does not collect personal information
                    directly, most requests will relate to analytics or advertising
                    cookies, which you can control through your browser and the opt-out
                    links above.
                </p>

                <h2>Changes to this policy</h2>
                <p>
                    This policy may be updated from time to time. Any changes will be
                    posted here with a revised date at the top of the page.
                </p>

                <h2>Contact</h2>
                <p>
                    Questions about this policy can be sent to{' '}
                    <strong>{siteConfig.email}</strong>, or through the{' '}
                    <Link href="/contact/">contact page</Link>.
                </p>
            </main>
        </>
    );
}