import Link from 'next/link';
import CommonFactorsCalculator from '../../components/CommonFactorsCalculator';
import Breadcrumb from '../../components/Breadcrumb';
import FAQAccordion from '../../components/FAQAccordion';
import AdSlot from '../../components/AdSlot';
import { absoluteUrl, nowIso } from '../../lib/siteConfig';
import {
    buildWebPage,
    buildSoftwareApplication,
    buildHowTo,
    buildSchemaGraph,
    serializeSchema,
} from '../../lib/schema';

export const metadata = {
    title: 'Common Factors Calculator',
    description:
        'Find every common factor of two or more numbers, not just the greatest. See the full shared factor list, count, sum, and a side-by-side factor comparison.',
    alternates: { canonical: absoluteUrl('/common-factors/') },
    openGraph: {
        title: 'Common Factors Calculator — Every Shared Factor',
        description:
            'List all common factors of two or more numbers with a side-by-side comparison.',
        url: absoluteUrl('/common-factors/'),
        type: 'website',
    },
};

const FAQS = [
    {
        question: 'What are common factors?',
        answer:
            'Common factors are whole numbers that divide two or more given numbers exactly. For example, the common factors of 36 and 60 are 1, 2, 3, 4, 6, and 12 — each of these divides both numbers with no remainder. Every set of whole numbers has at least one common factor: 1.',
    },
    {
        question: 'How do you find all the common factors of two numbers?',
        answer:
            'List every factor of each number, then identify the values that appear in both lists. A faster route is to find the greatest common factor first, then list its factors — because every common factor of two numbers is also a factor of their GCF. For 36 and 60, the GCF is 12, and the factors of 12 are 1, 2, 3, 4, 6, 12.',
    },
    {
        question: 'What is the difference between common factors and the GCF?',
        answer:
            'Common factors are the complete list of numbers that divide all the given numbers, while the GCF is just the largest one in that list. For 36 and 60, the common factors are 1, 2, 3, 4, 6, and 12, and the GCF is 12. The GCF is always the last entry in the common factor list.',
    },
    {
        question: 'What is the smallest common factor of any two numbers?',
        answer:
            'The smallest common factor of any set of whole numbers is always 1, because 1 divides every whole number exactly. This is why the phrase "least common factor" is not a useful term — the answer is always 1 regardless of which numbers you choose.',
    },
    {
        question: 'How many common factors do two numbers have?',
        answer:
            'The number of common factors equals the number of divisors of their GCF. For 36 and 60, the GCF is 12, and 12 has six divisors (1, 2, 3, 4, 6, 12) — so 36 and 60 have exactly six common factors.',
    },
    {
        question: 'Can two numbers have no common factors?',
        answer:
            'No. Every pair of whole numbers shares at least the factor 1. When 1 is the only shared factor, the numbers are called coprime or relatively prime — for example, 8 and 15 are coprime, since their only common factor is 1.',
    },
    {
        question: 'What are common prime factors?',
        answer:
            'Common prime factors are the prime numbers that divide all the given numbers. For 36 (2² × 3²) and 60 (2² × 3 × 5), the common prime factors are 2 and 3. The prime 5 is not shared because it appears only in 60.',
    },
    {
        question: 'How do you find common factors of three numbers?',
        answer:
            'The method is the same as for two numbers: find the GCF of all three, then list its factors. For 24, 36, and 60: the GCF is 12, so the common factors are 1, 2, 3, 4, 6, and 12.',
    },
    {
        question: 'Are common factors always smaller than the numbers?',
        answer:
            'Common factors are always less than or equal to the smallest number in the set. A common factor equals the smallest number when that number divides all the others — for example, the common factors of 6 and 18 are 1, 2, 3, and 6, where 6 is both a common factor and one of the inputs.',
    },
    {
        question: 'What are common factors used for?',
        answer:
            'Common factors are used to simplify fractions, reduce ratios, and divide items into equal groups. They also appear in algebra when factoring out shared terms from an expression, and in problems about arranging items into rows or packs of equal size.',
    },
];

function buildPageSchema() {
    const url = absoluteUrl('/common-factors/');

    const webPage = buildWebPage({
        url,
        name: 'Common Factors Calculator',
        description: metadata.description,
        dateModified: nowIso(),
    });

    const software = buildSoftwareApplication({
        name: 'Common Factors Calculator',
        url,
        description:
            'Free online calculator that lists every common factor of two or more numbers, with a side-by-side factor comparison and shared factor properties.',
        applicationCategory: 'EducationalApplication',
    });

    const howTo = buildHowTo({
        name: 'How to find all common factors of two numbers',
        description:
            'List every whole number that divides two or more numbers exactly.',
        totalTime: 'PT2M',
        steps: [
            {
                name: 'List the factors of each number',
                text: 'Write out every factor of each number. For 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. For 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60.',
                id: 'step-list',
            },
            {
                name: 'Find the values that appear in every list',
                text: 'Compare the lists and keep only the numbers present in all of them: 1, 2, 3, 4, 6, 12.',
                id: 'step-compare',
            },
            {
                name: 'Check using the GCF shortcut',
                text: 'Every common factor is a factor of the GCF. Here the GCF is 12, and the factors of 12 match the list exactly.',
                id: 'step-verify',
            },
        ],
    });

    return buildSchemaGraph(webPage, software, howTo);
}

export default function CommonFactorsPage() {
    const schema = buildPageSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb items={[{ name: 'Common Factors', href: '/common-factors/' }]} />
                </div>

                <section className="container-prose pb-6">
                    <h1 className="text-2xl sm:text-4xl m-0">Common Factors Calculator</h1>
                    <p className="mt-2 mb-5 text-sm sm:text-base text-ink-muted">
                        List every factor that two or more numbers share — not just the
                        greatest one.
                    </p>

                    <CommonFactorsCalculator initialValues={[36, 60]} />
                </section>

                <div className="container-prose">
                    <p className="text-base text-ink-soft leading-relaxed">
                        <strong>Common factors</strong> are the whole numbers that divide two
                        or more given numbers exactly. For example, 36 and 60 share six common
                        factors: 1, 2, 3, 4, 6, and 12. This calculator shows the complete
                        shared list with a side-by-side comparison, so you can see exactly
                        which factors overlap and which belong to only one number. If you need
                        just the largest shared factor, the{' '}
                        <Link href="/gcf-calculator/">GCF calculator</Link> gives it directly.
                    </p>
                </div>

                <div className="container-prose">
                    <AdSlot slotId="cf-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <section className="mt-10">
                        <h2 className="mt-0">Common factors vs the greatest common factor</h2>
                        <p>
                            These two ideas are closely related but answer different questions.
                            Common factors give you the <strong>whole list</strong>; the GCF
                            gives you <strong>one number</strong> from that list.
                        </p>
                        <p>
                            <strong>Worked example — 36 and 60:</strong>
                        </p>
                        <ul>
                            <li>Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36</li>
                            <li>Factors of 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60</li>
                            <li>
                                <strong>Common factors:</strong> 1, 2, 3, 4, 6, 12
                            </li>
                            <li>
                                <strong>GCF:</strong> 12 (the largest of those)
                            </li>
                        </ul>
                        <p>
                            When does the full list matter? Whenever you need every valid option
                            rather than the biggest one — for example, "what group sizes can I
                            split both sets into?" has six valid answers here, not one.
                        </p>

                        <h2>The GCF shortcut for finding common factors</h2>
                        <p>
                            There's a useful shortcut worth knowing:{' '}
                            <strong>
                                every common factor of a set of numbers is also a factor of their
                                GCF
                            </strong>
                            .
                        </p>
                        <p>
                            This means you don't need to list all the factors of every number and
                            compare them. Just find the GCF, then list its factors — that's the
                            complete common factor list.
                        </p>
                        <p>
                            For 36 and 60: the GCF is 12, and the factors of 12 are 1, 2, 3, 4,
                            6, 12. That matches the comparison above exactly, but with far less
                            work. This also tells you the <em>count</em> of common factors — it's
                            just the divisor count of the GCF.
                        </p>

                        <h2>Common prime factors</h2>
                        <p>
                            Among the common factors, some are prime. These are the{' '}
                            <strong>common prime factors</strong>, and they're what determine the
                            GCF.
                        </p>
                        <p>
                            <strong>Worked example — 36 and 60:</strong>
                        </p>
                        <ul>
                            <li>36 = 2² × 3²</li>
                            <li>60 = 2² × 3 × 5</li>
                            <li>Common primes: 2 and 3</li>
                            <li>Lowest shared powers: 2² and 3¹</li>
                        </ul>
                        <p>
                            Multiply the lowest shared powers: 2² × 3 = 12, which is the GCF. Use
                            the{' '}
                            <Link href="/prime-factorization/">prime factorization calculator</Link>{' '}
                            to break down any number.
                        </p>

                        <h2>Coprime numbers — when the only shared factor is 1</h2>
                        <p>
                            Some pairs of numbers share nothing but 1. These are called{' '}
                            <strong>coprime</strong> or relatively prime.
                        </p>
                        <p>
                            <strong>Example:</strong> 8 and 15. The factors of 8 are 1, 2, 4, 8;
                            the factors of 15 are 1, 3, 5, 15. The only overlap is 1, so 8 and 15
                            are coprime — even though neither number is prime itself.
                        </p>
                        <p>
                            Coprime pairs matter in practice: a fraction is in simplest form
                            exactly when its numerator and denominator are coprime.
                        </p>

                        <h2>Where common factors are used</h2>
                        <ul>
                            <li>
                                <strong>Simplifying fractions:</strong> dividing by any common
                                factor simplifies the fraction; dividing by the GCF simplifies it
                                fully in one step.
                            </li>
                            <li>
                                <strong>Equal grouping:</strong> with 36 red tiles and 60 blue
                                tiles, the common factors tell you every group size that works
                                evenly for both — 1, 2, 3, 4, 6, or 12 groups.
                            </li>
                            <li>
                                <strong>Reducing ratios:</strong> the ratio 36:60 can be reduced by
                                any common factor, giving 18:30, 12:20, 9:15, 6:10, or fully to 3:5.
                            </li>
                            <li>
                                <strong>Algebra:</strong> factoring out shared terms from an
                                expression starts with identifying common factors of the
                                coefficients.
                            </li>
                        </ul>

                        <h2>Related tools</h2>
                        <p>
                            To see all factors of a single number, use the{' '}
                            <Link href="/">factor calculator</Link>. For the smallest shared
                            multiple rather than shared factors, try the{' '}
                            <Link href="/lcm-calculator/">LCM calculator</Link>. And for divisor
                            properties like counts and sums, see the{' '}
                            <Link href="/divisors/">divisor calculator</Link>.
                        </p>
                    </section>
                </div>

                <div className="container-prose">
                    <FAQAccordion faqs={FAQS} />
                </div>

                <div className="container-prose">
                    <ReferencesSection />
                </div>
            </main>
        </>
    );
}

function ReferencesSection() {
    const refs = [
        {
            url: 'https://mathworld.wolfram.com/CommonDivisor.html',
            label: 'Wolfram MathWorld — Common Divisor',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Divisor',
            label: 'Wikipedia — Divisor',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Coprime_integers',
            label: 'Wikipedia — Coprime Integers',
        },
    ];

    return (
        <section className="mt-10 pt-6 border-t border-surface-border">
            <h2 className="mt-0 text-lg">References</h2>
            <ul className="text-sm">
                {refs.map((r) => (
                    <li key={r.url}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                            {r.label}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}