import Link from 'next/link';
import GcfCalculator from '../../components/GcfCalculator';
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
    title: {
        absolute: 'GCF Calculator — Greatest Common Factor (HCF)',
    },
    description:
        'Find the GCF of two or more numbers three ways: prime factorization, the Euclidean algorithm and factor listing — each with full working shown.',
    alternates: { canonical: absoluteUrl('/gcf-calculator/') },
    openGraph: {
        title: 'GCF Calculator — Greatest Common Factor (HCF)',
        description:
            'Find the greatest common factor of two or more numbers with three worked methods.',
        url: absoluteUrl('/gcf-calculator/'),
        type: 'website',
    },
};

const FAQS = [
    {
        question: 'What is the greatest common factor (GCF)?',
        answer:
            'The greatest common factor of two or more numbers is the largest whole number that divides all of them exactly. For example, the GCF of 48 and 60 is 12, because 12 divides both evenly and no larger number does. It is also called the highest common factor (HCF) or greatest common divisor (GCD).',
    },
    {
        question: 'Is GCF the same as HCF and GCD?',
        answer:
            'Yes — GCF (greatest common factor), HCF (highest common factor), and GCD (greatest common divisor) all mean exactly the same thing. GCF and GCD are more common in the United States, while HCF is standard in the United Kingdom, India, and Pakistan.',
    },
    {
        question: 'How do you find the GCF of two numbers?',
        answer:
            'There are three standard methods. List the factors of each number and pick the largest shared one; factorize both into primes and multiply the lowest power of each shared prime; or use the Euclidean algorithm, dividing repeatedly until the remainder is zero. All three give the same answer — the Euclidean method is fastest for large numbers.',
    },
    {
        question: 'What is the Euclidean algorithm?',
        answer:
            'The Euclidean algorithm finds the GCF by repeated division. Divide the larger number by the smaller, then replace the larger with the remainder, and repeat. When the remainder reaches 0, the last non-zero divisor is the GCF. For 48 and 60: 60 = 48 × 1 + 12, then 48 = 12 × 4 + 0, so the GCF is 12.',
    },
    {
        question: 'What is the GCF of two prime numbers?',
        answer:
            'The GCF of two different prime numbers is always 1, because a prime has no divisors other than 1 and itself. For example, GCF(7, 13) = 1. Numbers whose GCF is 1 are called coprime or relatively prime.',
    },
    {
        question: 'Can the GCF be larger than the smaller number?',
        answer:
            'No. The GCF can never exceed the smallest number in the set, because it must divide that number exactly. The GCF equals the smaller number when the smaller number divides the larger one — for example, GCF(6, 24) = 6.',
    },
    {
        question: 'What is the GCF used for?',
        answer:
            'The GCF is used to simplify fractions to lowest terms, to divide items into the largest possible equal groups, and to factor out common terms in algebra. For example, simplifying 18/24 means dividing both by their GCF of 6, giving 3/4.',
    },
    {
        question: 'How do you find the GCF of three or more numbers?',
        answer:
            'Find the GCF of the first two numbers, then find the GCF of that result and the third number, and continue through the set. For 12, 18, and 24: GCF(12, 18) = 6, then GCF(6, 24) = 6. So the GCF of all three is 6.',
    },
    {
        question: 'What is the difference between GCF and LCM?',
        answer:
            'The GCF is the largest number that divides all the given numbers, while the LCM is the smallest number that all of them divide into. For 4 and 6: the GCF is 2 and the LCM is 12. They are linked by the identity GCF × LCM = product of the two numbers.',
    },
    {
        question: 'What is the GCF of a number and itself?',
        answer:
            'The GCF of any number and itself is that number. For example, GCF(15, 15) = 15, because 15 is the largest number that divides 15 exactly.',
    },
];

function buildPageSchema() {
    const url = absoluteUrl('/gcf-calculator/');

    const webPage = buildWebPage({
        url,
        name: 'GCF Calculator — Greatest Common Factor',
        description: metadata.description,
        dateModified: nowIso(),
    });

    const software = buildSoftwareApplication({
        name: 'GCF Calculator',
        url,
        description:
            'Free online calculator that finds the greatest common factor (HCF/GCD) of two to five numbers using prime factorization, the Euclidean algorithm, and factor listing.',
        applicationCategory: 'EducationalApplication',
    });

    const howTo = buildHowTo({
        name: 'How to find the greatest common factor',
        description:
            'Find the largest number that divides two or more numbers exactly, using the Euclidean algorithm.',
        totalTime: 'PT2M',
        steps: [
            {
                name: 'Enter your numbers',
                text: 'Type two or more whole numbers into the calculator. Use the Add button for up to five numbers.',
                id: 'step-enter',
            },
            {
                name: 'Divide the larger by the smaller',
                text: 'Write the division as larger = smaller × quotient + remainder. For 60 and 48: 60 = 48 × 1 + 12.',
                id: 'step-divide',
            },
            {
                name: 'Repeat with the remainder',
                text: 'Replace the larger number with the smaller, and the smaller with the remainder. Continue: 48 = 12 × 4 + 0.',
                id: 'step-repeat',
            },
            {
                name: 'Read the GCF',
                text: 'When the remainder reaches 0, the last non-zero divisor is the greatest common factor. Here it is 12.',
                id: 'step-result',
            },
        ],
    });

    return buildSchemaGraph(webPage, software, howTo);
}

export default function GcfCalculatorPage() {
    const schema = buildPageSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb items={[{ name: 'GCF Calculator', href: '/gcf-calculator/' }]} />
                </div>

                <section className="container-prose pb-6">
                    <h1 className="text-2xl sm:text-4xl m-0">GCF Calculator</h1>
                    <p className="mt-2 mb-5 text-sm sm:text-base text-ink-muted">
                        Find the greatest common factor (also called HCF or GCD) of two or more
                        numbers, with three worked methods.
                    </p>

                    <GcfCalculator initialValues={[48, 60]} />
                </section>

                <div className="container-prose">
                    <p className="text-base text-ink-soft leading-relaxed">
                        The <strong>greatest common factor</strong> of a set of numbers is the
                        largest whole number that divides every one of them exactly. For example,
                        the GCF of 48 and 60 is 12. This calculator handles two to five numbers
                        and shows the full working for all three standard methods, so you can
                        check your own answer step by step. To see every shared factor rather
                        than just the largest, use the{' '}
                        <Link href="/common-factors/">common factors calculator</Link>.
                    </p>
                </div>

                <div className="container-prose">
                    <AdSlot slotId="gcf-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <section className="mt-10">
                        <h2 className="mt-0">GCF, HCF, and GCD — the same thing</h2>
                        <p>
                            These three names describe an identical idea and are used
                            interchangeably around the world:
                        </p>
                        <ul>
                            <li>
                                <strong>GCF</strong> — greatest common factor (common in the US)
                            </li>
                            <li>
                                <strong>HCF</strong> — highest common factor (common in the UK,
                                India, and Pakistan)
                            </li>
                            <li>
                                <strong>GCD</strong> — greatest common divisor (common in
                                mathematics and computer science)
                            </li>
                        </ul>
                        <p>
                            Whichever term your textbook uses, the calculation is the same, and
                            this calculator handles all of them.
                        </p>

                        <h2>Method 1 — Listing factors</h2>
                        <p>
                            The most intuitive method: write out all factors of each number and
                            find the largest one they share.
                        </p>
                        <p>
                            <strong>Worked example — GCF of 24 and 36:</strong>
                        </p>
                        <ul>
                            <li>Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24</li>
                            <li>Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36</li>
                            <li>Shared factors: 1, 2, 3, 4, 6, 12</li>
                        </ul>
                        <p>
                            The largest shared factor is <strong>12</strong>, so GCF(24, 36) = 12.
                        </p>
                        <p>
                            This method is clear for small numbers but slow for large ones — you
                            can use the <Link href="/">factor calculator</Link> to list factors
                            quickly.
                        </p>

                        <h2>Method 2 — Prime factorization</h2>
                        <p>
                            Break each number into primes, then take the{' '}
                            <strong>lowest power</strong> of every prime that appears in all of
                            them.
                        </p>
                        <p>
                            <strong>Worked example — GCF of 48 and 60:</strong>
                        </p>
                        <ul>
                            <li>48 = 2⁴ × 3</li>
                            <li>60 = 2² × 3 × 5</li>
                            <li>Shared primes: 2 (lowest power 2²) and 3 (lowest power 3¹)</li>
                        </ul>
                        <p>
                            GCF = 2² × 3 = <strong>12</strong>. The prime 5 is excluded because it
                            appears only in 60.
                        </p>
                        <p>
                            You can factorize any number with the{' '}
                            <Link href="/prime-factorization/">prime factorization calculator</Link>.
                        </p>

                        <h2>Method 3 — The Euclidean algorithm</h2>
                        <p>
                            The fastest method, and the one computers use. Divide the larger
                            number by the smaller, keep the remainder, and repeat until the
                            remainder is 0.
                        </p>
                        <p>
                            <strong>Worked example — GCF of 1071 and 462:</strong>
                        </p>
                        <ul>
                            <li>1071 = 462 × 2 + 147</li>
                            <li>462 = 147 × 3 + 21</li>
                            <li>147 = 21 × 7 + 0</li>
                        </ul>
                        <p>
                            The last non-zero divisor is <strong>21</strong>, so GCF(1071, 462) = 21.
                            Notice this took only three steps, while listing all factors of 1071
                            would take far longer.
                        </p>

                        <h2>The GCF and LCM relationship</h2>
                        <p>
                            For any two numbers, the GCF and the{' '}
                            <Link href="/lcm-calculator/">LCM</Link> are connected by a simple
                            identity:
                        </p>
                        <p>
                            <strong>GCF(a, b) × LCM(a, b) = a × b</strong>
                        </p>
                        <p>
                            For 48 and 60: GCF is 12, LCM is 240, and 12 × 240 = 2880 = 48 × 60.
                            This means once you know one, you can compute the other instantly.
                        </p>

                        <h2>Where the GCF is used</h2>
                        <ul>
                            <li>
                                <strong>Simplifying fractions:</strong> divide numerator and
                                denominator by their GCF. 18/24 ÷ 6 = 3/4.
                            </li>
                            <li>
                                <strong>Equal grouping:</strong> with 48 pens and 60 pencils, the
                                GCF of 12 tells you the largest number of identical kits you can
                                make — 4 pens and 5 pencils each.
                            </li>
                            <li>
                                <strong>Algebra:</strong> factoring out the greatest common factor
                                is the first step in simplifying most polynomial expressions.
                            </li>
                            <li>
                                <strong>Ratios:</strong> reducing a ratio to simplest form means
                                dividing both parts by their GCF.
                            </li>
                        </ul>
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
            url: 'https://mathworld.wolfram.com/GreatestCommonDivisor.html',
            label: 'Wolfram MathWorld — Greatest Common Divisor',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Greatest_common_divisor',
            label: 'Wikipedia — Greatest Common Divisor',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Euclidean_algorithm',
            label: 'Wikipedia — Euclidean Algorithm',
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