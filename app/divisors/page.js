import Link from 'next/link';
import DivisorCalculator from '../../components/DivisorCalculator';
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
    title: 'Divisor Calculator — Count & Sum',
    description:
        'Find all divisors of any number, plus divisor count d(n), divisor sum, aliquot sum, and classification as perfect, abundant, or deficient.',
    alternates: { canonical: absoluteUrl('/divisors/') },
    openGraph: {
        title: 'Divisor Calculator — Count, Sum & Properties',
        description:
            'All divisors of any number, with divisor count, divisor sum, and number classification.',
        url: absoluteUrl('/divisors/'),
        type: 'website',
    },
};

const FAQS = [
    {
        question: 'What is a divisor?',
        answer:
            'A divisor of a number is a whole number that divides it exactly, leaving no remainder. For example, the divisors of 12 are 1, 2, 3, 4, 6, and 12. In everyday arithmetic, divisor and factor mean the same thing.',
    },
    {
        question: 'What is the difference between a divisor and a factor?',
        answer:
            'For whole numbers, divisor and factor are interchangeable — both describe a number that divides another exactly. The slight difference is in emphasis: "divisor" is used when dividing (12 ÷ 3, where 3 is the divisor), while "factor" is used when multiplying (3 × 4 = 12, where 3 and 4 are factors).',
    },
    {
        question: 'What is the divisor function d(n)?',
        answer:
            'The divisor function d(n), also written τ(n), counts how many positive divisors a number has. For example, d(12) = 6 because 12 has six divisors. It is catalogued in the OEIS as sequence A000005.',
    },
    {
        question: 'How do you calculate the number of divisors?',
        answer:
            'Take the prime factorization, add 1 to each exponent, and multiply the results. For 120 = 2³ × 3 × 5, the divisor count is (3+1) × (1+1) × (1+1) = 4 × 2 × 2 = 16. So 120 has exactly 16 divisors without needing to list them.',
    },
    {
        question: 'What is the sum of divisors σ(n)?',
        answer:
            'The divisor sum σ(n) adds up every positive divisor of a number, including the number itself. For 12: 1 + 2 + 3 + 4 + 6 + 12 = 28, so σ(12) = 28. It is OEIS sequence A000203.',
    },
    {
        question: 'What are proper divisors?',
        answer:
            'Proper divisors are all divisors of a number except the number itself. For 12, the proper divisors are 1, 2, 3, 4, and 6. Their total is called the aliquot sum, which for 12 is 16.',
    },
    {
        question: 'What is a perfect number?',
        answer:
            'A perfect number equals the sum of its proper divisors. The smallest is 6, since 1 + 2 + 3 = 6. The next are 28, 496, and 8128. Perfect numbers are extremely rare — only 51 are known, and all discovered so far are even.',
    },
    {
        question: 'What are abundant and deficient numbers?',
        answer:
            'A number is abundant when its proper divisors sum to more than the number, and deficient when they sum to less. 12 is abundant because 1 + 2 + 3 + 4 + 6 = 16 > 12. Every prime number is deficient, since its only proper divisor is 1.',
    },
    {
        question: 'How many divisors does a prime number have?',
        answer:
            'Every prime number has exactly two divisors: 1 and itself. This is the defining property of a prime. For example, 17 has only the divisors 1 and 17.',
    },
    {
        question: 'Why do perfect squares have an odd number of divisors?',
        answer:
            'Divisors normally pair up, giving an even count. A perfect square has one divisor that pairs with itself — for 36, the pair (6, 6) counts once rather than twice. That leaves an odd total: 36 has 9 divisors. Perfect squares are the only numbers with an odd divisor count.',
    },
];

function buildPageSchema() {
    const url = absoluteUrl('/divisors/');

    const webPage = buildWebPage({
        url,
        name: 'Divisor Calculator',
        description: metadata.description,
        dateModified: nowIso(),
    });

    const software = buildSoftwareApplication({
        name: 'Divisor Calculator',
        url,
        description:
            'Free online calculator that lists all divisors of a number and computes divisor count, divisor sum, aliquot sum, and number classification.',
        applicationCategory: 'EducationalApplication',
    });

    const howTo = buildHowTo({
        name: 'How to find the number of divisors of a number',
        description:
            'Count every divisor of a whole number using its prime factorization, without listing them.',
        totalTime: 'PT1M',
        steps: [
            {
                name: 'Factorize the number into primes',
                text: 'Break the number into prime powers. For 120: 120 = 2³ × 3¹ × 5¹.',
                id: 'step-factorize',
            },
            {
                name: 'Add 1 to each exponent',
                text: 'The exponents are 3, 1, and 1. Adding 1 gives 4, 2, and 2.',
                id: 'step-addone',
            },
            {
                name: 'Multiply the results',
                text: '4 × 2 × 2 = 16. So 120 has exactly 16 divisors.',
                id: 'step-multiply',
            },
        ],
    });

    return buildSchemaGraph(webPage, software, howTo);
}

export default function DivisorsPage() {
    const schema = buildPageSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb items={[{ name: 'Divisors', href: '/divisors/' }]} />
                </div>

                <section className="container-prose pb-6">
                    <h1 className="text-2xl sm:text-4xl m-0">Divisor Calculator</h1>
                    <p className="mt-2 mb-5 text-sm sm:text-base text-ink-muted">
                        List every divisor of a number, plus divisor count, divisor sum, and
                        number classification.
                    </p>

                    <DivisorCalculator initialValue={120} />
                </section>

                <div className="container-prose">
                    <p className="text-base text-ink-soft leading-relaxed">
                        A <strong>divisor</strong> of a number is any whole number that divides
                        it exactly, with no remainder. This calculator goes beyond listing
                        divisors — it computes the divisor count d(n), the divisor sum σ(n),
                        the aliquot sum, and classifies the number as perfect, abundant, or
                        deficient. For example, 120 has 16 divisors that sum to 360. For a
                        plainer factor list, use the{' '}
                        <Link href="/">factor calculator</Link>.
                    </p>
                </div>

                <div className="container-prose">
                    <AdSlot slotId="div-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <section className="mt-10">
                        <h2 className="mt-0">Divisor or factor — which term is right?</h2>
                        <p>
                            For whole numbers, <strong>divisor</strong> and{' '}
                            <strong>factor</strong> mean the same thing. The difference is only
                            in how you're thinking about the operation:
                        </p>
                        <ul>
                            <li>
                                <strong>Divisor</strong> — used when dividing. In 12 ÷ 3 = 4, the
                                number 3 is the divisor.
                            </li>
                            <li>
                                <strong>Factor</strong> — used when multiplying. In 3 × 4 = 12,
                                both 3 and 4 are factors.
                            </li>
                        </ul>
                        <p>
                            Number theory tends to prefer "divisor" and uses the notation d(n)
                            and σ(n); school arithmetic tends to prefer "factor". The list of
                            numbers is identical either way.
                        </p>

                        <h2>The divisor count function d(n)</h2>
                        <p>
                            The <strong>divisor function</strong> d(n) — sometimes written τ(n) —
                            tells you how many positive divisors a number has, without listing
                            them.
                        </p>
                        <p>
                            The rule: take the prime factorization, add 1 to each exponent, then
                            multiply.
                        </p>
                        <p>
                            <strong>Worked example — 120:</strong>
                        </p>
                        <ul>
                            <li>120 = 2³ × 3¹ × 5¹</li>
                            <li>Exponents: 3, 1, 1</li>
                            <li>Add 1 to each: 4, 2, 2</li>
                            <li>Multiply: 4 × 2 × 2 = 16</li>
                        </ul>
                        <p>
                            So 120 has exactly <strong>16 divisors</strong>. This works because
                            each divisor is built by choosing a power of 2 (from 2⁰ to 2³ — four
                            options), a power of 3 (two options), and a power of 5 (two options).
                        </p>
                        <p>
                            You can get any prime factorization from the{' '}
                            <Link href="/prime-factorization/">prime factorization calculator</Link>.
                        </p>

                        <h2>The divisor sum function σ(n)</h2>
                        <p>
                            The <strong>divisor sum</strong> σ(n) adds every divisor together,
                            including the number itself. There's a formula that avoids adding
                            them one by one.
                        </p>
                        <p>
                            For each prime power p<sup>e</sup> in the factorization, the
                            contribution is (p<sup>e+1</sup> − 1) ÷ (p − 1). Multiply all the
                            contributions.
                        </p>
                        <p>
                            <strong>Worked example — 12 = 2² × 3:</strong>
                        </p>
                        <ul>
                            <li>For 2²: (2³ − 1) ÷ (2 − 1) = 7 ÷ 1 = 7</li>
                            <li>For 3¹: (3² − 1) ÷ (3 − 1) = 8 ÷ 2 = 4</li>
                            <li>σ(12) = 7 × 4 = 28</li>
                        </ul>
                        <p>
                            Checking by hand: 1 + 2 + 3 + 4 + 6 + 12 = 28. The formula matches.
                        </p>

                        <h2>Perfect, abundant, and deficient numbers</h2>
                        <p>
                            Comparing a number to the sum of its <strong>proper divisors</strong>{' '}
                            (all divisors except the number itself) gives a classification used
                            throughout number theory.
                        </p>
                        <div className="overflow-x-auto">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Condition</th>
                                        <th>Examples</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Perfect</strong>
                                        </td>
                                        <td>Proper divisors sum to exactly n</td>
                                        <td>6, 28, 496, 8128</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Abundant</strong>
                                        </td>
                                        <td>Proper divisors sum to more than n</td>
                                        <td>12, 18, 20, 24, 30</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Deficient</strong>
                                        </td>
                                        <td>Proper divisors sum to less than n</td>
                                        <td>All primes, plus 4, 8, 9, 10</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p>
                            <strong>Perfect numbers are strikingly rare.</strong> Only 51 are
                            known, the smallest being 6 (1 + 2 + 3 = 6) and 28 (1 + 2 + 4 + 7 +
                            14 = 28). Every one discovered so far is even, and whether an odd
                            perfect number exists is still an open problem in mathematics.
                        </p>

                        <h2>Why perfect squares have an odd divisor count</h2>
                        <p>
                            Divisors normally come in pairs. For 12: (1, 12), (2, 6), (3, 4) —
                            six divisors from three pairs. Because pairs come in twos, most
                            numbers have an <em>even</em> divisor count.
                        </p>
                        <p>
                            Perfect squares break this pattern. For 36 the pairs are (1, 36), (2,
                            18), (3, 12), (4, 9), and (6, 6). That last pair uses 6 twice, so it
                            contributes only one divisor. The total is <strong>9</strong> — odd.
                        </p>
                        <p>
                            This makes a neat test: a number has an odd number of divisors if and
                            only if it is a perfect square.
                        </p>

                        <h2>Related tools</h2>
                        <p>
                            To find divisors shared between numbers, use the{' '}
                            <Link href="/common-factors/">common factors calculator</Link> or the{' '}
                            <Link href="/gcf-calculator/">GCF calculator</Link>. For multiples
                            rather than divisors, see the{' '}
                            <Link href="/lcm-calculator/">LCM calculator</Link>.
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
            url: 'https://mathworld.wolfram.com/DivisorFunction.html',
            label: 'Wolfram MathWorld — Divisor Function',
        },
        {
            url: 'https://oeis.org/A000005',
            label: 'OEIS A000005 — Number of divisors of n',
        },
        {
            url: 'https://oeis.org/A000203',
            label: 'OEIS A000203 — Sum of divisors of n',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Perfect_number',
            label: 'Wikipedia — Perfect Number',
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