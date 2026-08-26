import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { siteConfig, absoluteUrl, nowIso } from '../../lib/siteConfig';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

export const metadata = {
    title: 'About Factor Calculator',
    description:
        'About Factor Calculator — free math tools for factors, prime factorization, GCF, LCM, and divisor properties, built for students and teachers.',
    alternates: { canonical: absoluteUrl('/about/') },
};

export default function AboutPage() {
    const schema = buildSchemaGraph(
        buildWebPage({
            url: absoluteUrl('/about/'),
            name: 'About Factor Calculator',
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
                <Breadcrumb items={[{ name: 'About', href: '/about/' }]} />

                <h1>About Factor Calculator</h1>

                <p>
                    Factor Calculator is a free set of math tools for working with factors,
                    prime factorization, and divisors. Every calculator shows the full
                    working, not just the answer — the goal is that you leave understanding
                    the method, not only the result.
                </p>

                <h2>What this site does</h2>
                <p>
                    The site covers the core operations students meet when learning about
                    factors and divisibility:
                </p>
                <ul>
                    <li>
                        <Link href="/">Factor Calculator</Link> — every factor of a number,
                        with factor pairs and a factor tree
                    </li>
                    <li>
                        <Link href="/prime-factorization/">Prime Factorization</Link> — break
                        a number into primes with step-by-step division
                    </li>
                    <li>
                        <Link href="/gcf-calculator/">GCF Calculator</Link> — greatest common
                        factor via three methods
                    </li>
                    <li>
                        <Link href="/lcm-calculator/">LCM Calculator</Link> — least common
                        multiple with worked steps
                    </li>
                    <li>
                        <Link href="/common-factors/">Common Factors</Link> — every shared
                        factor, not just the largest
                    </li>
                    <li>
                        <Link href="/divisors/">Divisor Calculator</Link> — divisor count,
                        divisor sum, and number classification
                    </li>
                </ul>
                <p>
                    There are also individual reference pages for every number from 1 to
                    1200 — for example{' '}
                    <Link href="/factors-of-12/">factors of 12</Link> or{' '}
                    <Link href="/factors-of-100/">factors of 100</Link>. You can browse them
                    all on the <Link href="/sitemap/">sitemap</Link>.
                </p>

                <h2>How the calculations work</h2>
                <p>
                    All calculations run directly in your browser using standard number
                    theory algorithms — trial division up to the square root for factors,
                    the Euclidean algorithm for GCF, and the divisor function formulas for
                    counts and sums. Nothing is sent to a server, and no data about your
                    inputs is stored.
                </p>
                <p>
                    The results are verified against established mathematical references,
                    including the On-Line Encyclopedia of Integer Sequences (OEIS) for
                    divisor counts and divisor sums.
                </p>

                <h2>Who built this</h2>
                <p>
                    Factor Calculator is built and maintained by {siteConfig.author.name}, a
                    web developer working on educational tools. If you spot an error,
                    have a suggestion, or want a calculator added, the{' '}
                    <Link href="/contact/">contact page</Link> is the fastest way to reach
                    me.
                </p>

                <h2>Accuracy and corrections</h2>
                <p>
                    Mathematical accuracy is the priority here. Every calculator is covered
                    by automated tests that check results against known values before any
                    change goes live. If you do find something wrong, please report it —
                    corrections are made quickly and the fix applies across every page that
                    uses the same calculation.
                </p>

                <h2>Cost</h2>
                <p>
                    Everything on this site is free to use, with no sign-up, no usage
                    limits, and no paywalled features.
                </p>
            </main>
        </>
    );
}