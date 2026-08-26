import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import FAQAccordion from '../../components/FAQAccordion';
import AdSlot from '../../components/AdSlot';
import NumberPageContent from '../../components/NumberPageContent';
import RelatedNumbersGrid from '../../components/RelatedNumbersGrid';
import { absoluteUrl, nowIso } from '../../lib/siteConfig';
import {
    buildNumberFacts,
    buildAnswerParagraph,
    buildNotes,
    buildNumberFaqs,
    buildTitle,
    buildDescription,
} from '../../lib/numberFacts';
import { buildWebPage, buildSchemaGraph, serializeSchema } from '../../lib/schema';

const MAX_PAGE = 1200;
const SLUG_PREFIX = 'factors-of-';

/**
 * Pre-render /factors-of-1/ … /factors-of-1200/ at build time.
 * Static routes like /gcf-calculator/ take priority over this dynamic segment,
 * and dynamicParams=false means anything else 404s.
 */
export function generateStaticParams() {
    const params = [];
    for (let i = 1; i <= MAX_PAGE; i++) {
        params.push({ slug: `${SLUG_PREFIX}${i}` });
    }
    return params;
}

export const dynamicParams = false;

/** Extract the number from a "factors-of-N" slug, or null if it isn't one. */
function parseSlug(slug) {
    if (typeof slug !== 'string' || !slug.startsWith(SLUG_PREFIX)) return null;
    const rest = slug.slice(SLUG_PREFIX.length);
    if (!/^\d+$/.test(rest)) return null;
    const n = Number(rest);
    if (!Number.isInteger(n) || n < 1 || n > MAX_PAGE) return null;
    // Reject leading zeros so /factors-of-012/ doesn't duplicate /factors-of-12/
    if (String(n) !== rest) return null;
    return n;
}

export async function generateMetadata({ params }) {
    const resolved = await params;
    const n = parseSlug(resolved.slug);
    if (!n) return {};

    const facts = buildNumberFacts(n);
    const url = absoluteUrl(`/factors-of-${n}/`);

    return {
        title: buildTitle(facts),
        description: buildDescription(facts),
        alternates: { canonical: url },
        openGraph: {
            title: buildTitle(facts),
            description: buildDescription(facts),
            url,
            type: 'article',
        },
    };
}

export default async function FactorsOfNumberPage({ params }) {
    const resolved = await params;
    const n = parseSlug(resolved.slug);

    if (!n) {
        notFound();
    }

    const facts = buildNumberFacts(n);
    const answer = buildAnswerParagraph(facts);
    const notes = buildNotes(facts);
    const faqs = buildNumberFaqs(facts);
    const url = absoluteUrl(`/factors-of-${n}/`);

    const webPage = buildWebPage({
        url,
        name: `Factors of ${n}`,
        description: buildDescription(facts),
        dateModified: nowIso(),
    });

    const schema = buildSchemaGraph(webPage);
    const relatedWithTags = buildRelatedTags(n, facts);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb
                        items={[{ name: `Factors of ${n}`, href: `/factors-of-${n}/` }]}
                    />
                </div>

                <section className="container-prose">
                    <h1 className="text-2xl sm:text-4xl m-0">Factors of {n}</h1>
                    <p className="mt-4 text-base text-ink-soft leading-relaxed">{answer}</p>
                </section>

                <div className="container-prose">
                    <AdSlot slotId="num-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <NumberPageContent facts={facts} notes={notes} />
                </div>

                <div className="container-content">
                    <RelatedNumbersGrid
                        numbers={relatedWithTags}
                        title="Related numbers"
                        description={`Numbers mathematically connected to ${n}.`}
                        columns={4}
                    />
                </div>

                <div className="container-prose">
                    <FAQAccordion
                        faqs={faqs}
                        title={`Frequently asked questions about ${n}`}
                    />
                </div>

                <div className="container-prose">
                    <OtherToolsSection n={n} />
                </div>
            </main>
        </>
    );
}

/** Attach a short explanation to each related number. */
function buildRelatedTags(n, facts) {
    const tagged = [];
    const seen = new Set();

    const push = (value, tag) => {
        if (
            Number.isInteger(value) &&
            value >= 1 &&
            value <= MAX_PAGE &&
            value !== n &&
            !seen.has(value)
        ) {
            seen.add(value);
            tagged.push({ n: value, tag });
        }
    };

    push(n - 1, 'Previous number');
    push(n + 1, 'Next number');
    if (n % 2 === 0) push(n / 2, `Half of ${n}`);
    push(n * 2, `Double of ${n}`);

    for (const p of facts.distinctPrimes) {
        push(p, 'Prime factor');
    }

    const sqrtFloor = Math.floor(Math.sqrt(n));
    push(sqrtFloor * sqrtFloor, 'Nearest square below');
    push((sqrtFloor + 1) * (sqrtFloor + 1), 'Nearest square above');

    return tagged.slice(0, 12);
}

function OtherToolsSection({ n }) {
    return (
        <section className="mt-10 pt-6 border-t border-surface-border">
            <h2 className="mt-0 text-lg">Explore more</h2>
            <p className="text-sm text-ink-soft">
                Try another number in the <Link href="/">factor calculator</Link>, break{' '}
                {n} down further with the{' '}
                <Link href="/prime-factorization/">prime factorization calculator</Link>,
                or compare {n} with another number using the{' '}
                <Link href="/gcf-calculator/">GCF calculator</Link> and{' '}
                <Link href="/lcm-calculator/">LCM calculator</Link>. For divisor counts
                and sums, see the <Link href="/divisors/">divisor calculator</Link>.
            </p>
        </section>
    );
}