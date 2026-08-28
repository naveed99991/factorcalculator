import Link from 'next/link';
import PrimeFactorizationCalculator from '../../components/PrimeFactorizationCalculator';
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
        absolute: 'Prime Factorization Calculator with Steps',
    },
    description:
        'Break any number into its prime factors with every division step shown, plus exponent form, factor tree and divisor count. Free and instant.',
    alternates: { canonical: absoluteUrl('/prime-factorization/') },
    openGraph: {
        title: 'Prime Factorization Calculator with Steps',
        description:
            'Break any number into primes with step-by-step division and a visual factor tree.',
        url: absoluteUrl('/prime-factorization/'),
        type: 'website',
    },
};

const FAQS = [
    {
        question: 'What is prime factorization?',
        answer:
            'Prime factorization is the process of writing a number as a product of prime numbers. For example, the prime factorization of 360 is 2³ × 3² × 5, because 2 × 2 × 2 × 3 × 3 × 5 = 360. Every whole number greater than 1 has exactly one prime factorization — a result known as the Fundamental Theorem of Arithmetic.',
    },
    {
        question: 'How do you find the prime factorization of a number?',
        answer:
            'Divide the number by the smallest prime that goes in evenly, then repeat with the quotient until you reach 1. For 84: 84 ÷ 2 = 42, 42 ÷ 2 = 21, 21 ÷ 3 = 7, 7 ÷ 7 = 1. The prime factors are 2, 2, 3, 7, written as 2² × 3 × 7.',
    },
    {
        question: 'What is the prime factorization formula?',
        answer:
            'There is no single formula — prime factorization is an algorithm, not an equation. The standard method is trial division: test each prime from 2 upward, dividing whenever it goes in evenly, and stop when the divisor squared exceeds the remaining quotient. Any leftover value greater than 1 is itself prime.',
    },
    {
        question: 'What does it mean to factorize a number?',
        answer:
            'To factorize a number means to write it as a product of smaller whole numbers. For example, 12 can be factorized as 3 × 4, 2 × 6, or fully into primes as 2² × 3. Full factorization into primes is unique, while ordinary factorization into any factors is not.',
    },
    {
        question: 'What is exponent form in prime factorization?',
        answer:
            'Exponent form groups repeated prime factors using powers. Instead of writing 72 = 2 × 2 × 2 × 3 × 3, you write 72 = 2³ × 3². Both mean the same thing, but exponent form is shorter and makes it easier to compare numbers or compute divisor counts.',
    },
    {
        question: 'Can you find the prime factorization of a prime number?',
        answer:
            'A prime number is its own prime factorization. For example, the prime factorization of 17 is simply 17, because 17 cannot be broken into smaller prime factors. It has exactly two divisors: 1 and itself.',
    },
    {
        question: 'What is the prime factorization of 1?',
        answer:
            'The number 1 has no prime factorization. It is neither prime nor composite — it is called a unit. By convention, 1 is treated as the empty product, which is why prime factorization is defined only for numbers greater than 1.',
    },
    {
        question: 'How do you count divisors from prime factorization?',
        answer:
            'Add 1 to each exponent in the prime factorization and multiply the results. For 360 = 2³ × 3² × 5¹, the divisor count is (3+1) × (2+1) × (1+1) = 4 × 3 × 2 = 24. So 360 has exactly 24 divisors, without needing to list them.',
    },
    {
        question: 'What is a factor tree and how does it work?',
        answer:
            'A factor tree is a diagram that shows prime factorization visually. Start with the number at the top, split it into any two factors, then keep splitting each composite branch until every endpoint is prime. For 36: 36 → 4 × 9 → (2 × 2) × (3 × 3), giving 2² × 3².',
    },
    {
        question: 'Why is prime factorization important?',
        answer:
            'Prime factorization is used to find the greatest common factor (GCF) and least common multiple (LCM), to simplify fractions, and to solve divisibility problems. It also underpins RSA encryption, where the security of the system depends on how hard it is to factorize very large numbers.',
    },
];

function buildPageSchema() {
    const url = absoluteUrl('/prime-factorization/');

    const webPage = buildWebPage({
        url,
        name: 'Prime Factorization Calculator',
        description: metadata.description,
        dateModified: nowIso(),
    });

    const software = buildSoftwareApplication({
        name: 'Prime Factorization Calculator',
        url,
        description:
            'Free online calculator that finds the prime factorization of any number with step-by-step division, exponent form, and a visual factor tree.',
        applicationCategory: 'EducationalApplication',
    });

    const howTo = buildHowTo({
        name: 'How to find the prime factorization of a number',
        description:
            'Break any whole number into its prime factors using repeated division by the smallest prime.',
        totalTime: 'PT2M',
        steps: [
            {
                name: 'Start with the smallest prime',
                text: 'Divide your number by 2. If it divides evenly, keep dividing by 2 until it no longer does.',
                id: 'step-two',
            },
            {
                name: 'Move to the next prime',
                text: 'Try 3, then 5, then 7, and so on. Divide as many times as each prime goes in evenly.',
                id: 'step-next',
            },
            {
                name: 'Stop at the square root',
                text: 'Once your test divisor squared exceeds the remaining quotient, stop. Whatever is left, if greater than 1, is itself prime.',
                id: 'step-sqrt',
            },
            {
                name: 'Write the result in exponent form',
                text: 'Group repeated primes into powers. For example, 2 × 2 × 2 × 3 × 3 becomes 2³ × 3².',
                id: 'step-exponent',
            },
        ],
    });

    return buildSchemaGraph(webPage, software, howTo);
}

export default function PrimeFactorizationPage() {
    const schema = buildPageSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb
                        items={[{ name: 'Prime Factorization', href: '/prime-factorization/' }]}
                    />
                </div>

                <section className="container-prose pb-6">
                    <h1 className="text-2xl sm:text-4xl m-0">Prime Factorization Calculator</h1>
                    <p className="mt-2 mb-5 text-sm sm:text-base text-ink-muted">
                        Break any number into its prime factors with step-by-step division,
                        exponent form, and a visual factor tree.
                    </p>

                    <PrimeFactorizationCalculator initialValue={360} />
                </section>

                <div className="container-prose">
                    <p className="text-base text-ink-soft leading-relaxed">
                        The <strong>prime factorization</strong> of a number is the unique way
                        of writing it as a product of prime numbers. For example, 360 = 2³ × 3² × 5.
                        This calculator handles any whole number up to one trillion and shows
                        every division step, so you can follow the method rather than just copy
                        the answer. To find all divisors instead of just the primes, use the{' '}
                        <Link href="/">factor calculator</Link>.
                    </p>
                </div>

                <div className="container-prose">
                    <AdSlot slotId="pf-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <section className="mt-10">
                        <h2 className="mt-0">What is prime factorization?</h2>
                        <p>
                            Every whole number greater than 1 is either a prime number or can be
                            written as a product of primes. <strong>Prime factorization</strong>{' '}
                            is the process of finding those primes.
                        </p>
                        <p>
                            What makes it special is uniqueness. The number 84 factorizes as
                            2² × 3 × 7, and there is no other combination of primes that
                            multiplies to 84. This is the{' '}
                            <strong>Fundamental Theorem of Arithmetic</strong>, and it's why
                            prime factorization is a reliable foundation for other calculations
                            like GCF, LCM, and fraction simplification.
                        </p>
                        <p>
                            A <strong>prime number</strong> has exactly two divisors: 1 and
                            itself. The first primes are 2, 3, 5, 7, 11, 13, 17, 19, 23, and 29.
                            Numbers with more than two divisors are <strong>composite</strong>,
                            and only composite numbers can be broken down further.
                        </p>

                        <h2>How to factorize a number step by step</h2>
                        <p>
                            The standard approach is the <strong>division method</strong>, also
                            called the ladder method. Work through the primes in order,
                            dividing as many times as each one goes in evenly.
                        </p>
                        <p>
                            <strong>Worked example — 84:</strong>
                        </p>
                        <ul>
                            <li>84 ÷ 2 = 42 (2 divides evenly, so divide again)</li>
                            <li>42 ÷ 2 = 21 (2 no longer divides 21, move to 3)</li>
                            <li>21 ÷ 3 = 7 (3 no longer divides 7, move on)</li>
                            <li>7 ÷ 7 = 1 (7 is prime — we're done)</li>
                        </ul>
                        <p>
                            Prime factors: 2, 2, 3, 7. In exponent form:{' '}
                            <strong>84 = 2² × 3 × 7</strong>.
                        </p>
                        <p>
                            <strong>Shortcut:</strong> you never need to test a divisor larger
                            than the square root of the remaining quotient. Once your test
                            divisor squared exceeds what's left, whatever remains is prime.
                        </p>

                        <h2>The factor tree method</h2>
                        <p>
                            A <strong>factor tree</strong> reaches the same answer visually.
                            Split the number into any two factors, then keep splitting composite
                            branches until every leaf is prime.
                        </p>
                        <p>
                            <strong>Worked example — 180:</strong>
                        </p>
                        <ul>
                            <li>180 splits into 18 × 10</li>
                            <li>18 splits into 2 × 9, and 9 splits into 3 × 3</li>
                            <li>10 splits into 2 × 5</li>
                        </ul>
                        <p>
                            The prime leaves are 2, 3, 3, 2, 5 — giving{' '}
                            <strong>180 = 2² × 3² × 5</strong>. Notice that even if you start by
                            splitting 180 into 4 × 45 instead, you end up with the same primes.
                            The path differs; the result never does.
                        </p>

                        <h2>Counting divisors from the prime factorization</h2>
                        <p>
                            Prime factorization gives you a shortcut for counting all divisors of
                            a number without listing them. Add 1 to each exponent, then multiply.
                        </p>
                        <p>
                            For 360 = 2³ × 3² × 5¹, the divisor count is
                            (3+1) × (2+1) × (1+1) = 4 × 3 × 2 = <strong>24 divisors</strong>. The
                            calculator above shows this derivation for whatever number you enter.
                        </p>
                        <p>
                            This is why <Link href="/divisors/">divisor properties</Link> and prime
                            factorization are so closely linked — one determines the other.
                        </p>

                        <h2>Where prime factorization is used</h2>
                        <ul>
                            <li>
                                <strong>Simplifying fractions:</strong> factorize numerator and
                                denominator, then cancel shared primes.
                            </li>
                            <li>
                                <strong>Finding the GCF:</strong> take the lowest power of each
                                shared prime. Try the{' '}
                                <Link href="/gcf-calculator/">GCF calculator</Link>.
                            </li>
                            <li>
                                <strong>Finding the LCM:</strong> take the highest power of every
                                prime that appears. Try the{' '}
                                <Link href="/lcm-calculator/">LCM calculator</Link>.
                            </li>
                            <li>
                                <strong>Cryptography:</strong> RSA encryption relies on the fact
                                that factorizing a product of two large primes is computationally
                                hard.
                            </li>
                        </ul>
                    </section>
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
            url: 'https://mathworld.wolfram.com/PrimeFactorization.html',
            label: 'Wolfram MathWorld — Prime Factorization',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Integer_factorization',
            label: 'Wikipedia — Integer Factorization',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic',
            label: 'Wikipedia — Fundamental Theorem of Arithmetic',
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