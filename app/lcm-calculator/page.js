import Link from 'next/link';
import LcmCalculator from '../../components/LcmCalculator';
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
        absolute: 'LCM Calculator — Least Common Multiple',
    },
    description:
        'Find the LCM of two or more numbers using prime factorization, the GCF formula, or listing multiples. Every step shown. Free and instant.',
    alternates: { canonical: absoluteUrl('/lcm-calculator/') },
    openGraph: {
        title: 'LCM Calculator — Least Common Multiple',
        description:
            'Find the least common multiple of two or more numbers with three worked methods.',
        url: absoluteUrl('/lcm-calculator/'),
        type: 'website',
    },
};

const FAQS = [
    {
        question: 'What is the least common multiple (LCM)?',
        answer:
            'The least common multiple of two or more numbers is the smallest positive number that all of them divide into exactly. For example, the LCM of 4 and 6 is 12, because 12 is the smallest number that both 4 and 6 divide evenly.',
    },
    {
        question: 'How do you find the LCM of two numbers?',
        answer:
            'There are three standard methods. List the multiples of each number and find the first shared one; factorize both into primes and take the highest power of every prime; or use the formula LCM(a, b) = (a × b) ÷ GCF(a, b). For 12 and 18: GCF is 6, so LCM = (12 × 18) ÷ 6 = 36.',
    },
    {
        question: 'What is the LCM formula?',
        answer:
            'For two numbers, LCM(a, b) = (a × b) ÷ GCF(a, b). This works because the product of two numbers always equals their GCF times their LCM. For three or more numbers, apply the formula in pairs: find the LCM of the first two, then the LCM of that result and the next number.',
    },
    {
        question: 'What is the difference between LCM and GCF?',
        answer:
            'The LCM is the smallest number that all the given numbers divide into, while the GCF is the largest number that divides all of them. For 12 and 18: the LCM is 36 and the GCF is 6. The LCM is always greater than or equal to the largest input; the GCF is always less than or equal to the smallest.',
    },
    {
        question: 'What is the LCM of two prime numbers?',
        answer:
            'The LCM of two different prime numbers is simply their product, because they share no factors. For example, LCM(7, 11) = 77. This is the case for any two coprime numbers, whether or not they are prime.',
    },
    {
        question: 'Can the LCM be smaller than the given numbers?',
        answer:
            'No. The LCM is always greater than or equal to the largest of the given numbers, since it must be a multiple of each one. The LCM equals the largest number when that number is divisible by all the others — for example, LCM(3, 6, 12) = 12.',
    },
    {
        question: 'What is the LCM used for?',
        answer:
            'The most common use is adding and subtracting fractions with different denominators — you convert both to the least common denominator, which is the LCM of the denominators. It also solves scheduling problems, such as finding when two repeating events coincide.',
    },
    {
        question: 'How do you find the LCM of three or more numbers?',
        answer:
            'Work in pairs. Find the LCM of the first two numbers, then find the LCM of that result and the third number, and continue through the set. For 4, 6, and 10: LCM(4, 6) = 12, then LCM(12, 10) = 60. So the LCM of all three is 60.',
    },
    {
        question: 'Is "least common factor" the same as LCM?',
        answer:
            'No — "least common factor" is a common mix-up. The least common factor of any set of numbers is always 1, since 1 divides everything, so the term is not useful. People searching for it usually mean either the least common multiple (LCM) or the greatest common factor (GCF).',
    },
    {
        question: 'What is a least common denominator?',
        answer:
            'The least common denominator (LCD) is the LCM of the denominators of two or more fractions. To add 1/4 and 1/6, you find LCM(4, 6) = 12, convert to 3/12 and 2/12, then add to get 5/12.',
    },
];

function buildPageSchema() {
    const url = absoluteUrl('/lcm-calculator/');

    const webPage = buildWebPage({
        url,
        name: 'LCM Calculator — Least Common Multiple',
        description: metadata.description,
        dateModified: nowIso(),
    });

    const software = buildSoftwareApplication({
        name: 'LCM Calculator',
        url,
        description:
            'Free online calculator that finds the least common multiple of two to five numbers using prime factorization, the GCF formula, and listing multiples.',
        applicationCategory: 'EducationalApplication',
    });

    const howTo = buildHowTo({
        name: 'How to find the least common multiple',
        description:
            'Find the smallest number that two or more numbers all divide into exactly.',
        totalTime: 'PT2M',
        steps: [
            {
                name: 'Enter your numbers',
                text: 'Type two or more whole numbers into the calculator. Use the Add button for up to five numbers.',
                id: 'step-enter',
            },
            {
                name: 'Factorize each number into primes',
                text: 'Break every number into its prime factors. For 12 and 18: 12 = 2² × 3 and 18 = 2 × 3².',
                id: 'step-factorize',
            },
            {
                name: 'Take the highest power of each prime',
                text: 'From 2² and 2¹, keep 2². From 3¹ and 3², keep 3². Include every prime that appears in any number.',
                id: 'step-highest',
            },
            {
                name: 'Multiply the results',
                text: 'Multiply the highest powers together: 2² × 3² = 4 × 9 = 36. That is the LCM.',
                id: 'step-multiply',
            },
        ],
    });

    return buildSchemaGraph(webPage, software, howTo);
}

export default function LcmCalculatorPage() {
    const schema = buildPageSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
            />

            <main>
                <div className="container-prose pt-4">
                    <Breadcrumb items={[{ name: 'LCM Calculator', href: '/lcm-calculator/' }]} />
                </div>

                <section className="container-prose pb-6">
                    <h1 className="text-2xl sm:text-4xl m-0">LCM Calculator</h1>
                    <p className="mt-2 mb-5 text-sm sm:text-base text-ink-muted">
                        Find the least common multiple of two or more numbers, with three
                        worked methods.
                    </p>

                    <LcmCalculator initialValues={[12, 18]} />
                </section>

                <div className="container-prose">
                    <p className="text-base text-ink-soft leading-relaxed">
                        The <strong>least common multiple</strong> of a set of numbers is the
                        smallest positive number that every one of them divides into exactly.
                        For example, the LCM of 12 and 18 is 36. This calculator handles two to
                        five numbers and shows the full working for all three standard methods.
                        For the largest shared divisor instead, use the{' '}
                        <Link href="/gcf-calculator/">GCF calculator</Link>.
                    </p>
                </div>

                <div className="container-prose">
                    <AdSlot slotId="lcm-in-content-1" placement="in-content" />
                </div>

                <div className="container-prose">
                    <section className="mt-10">
                        <h2 className="mt-0">LCM vs "least common factor"</h2>
                        <p>
                            A quick clarification, because these two get mixed up constantly. The{' '}
                            <strong>least common multiple</strong> is a real and useful idea — the
                            smallest number that all your inputs divide into.
                        </p>
                        <p>
                            The phrase <strong>"least common factor"</strong> is not useful,
                            because the answer is always 1. Every whole number is divisible by 1,
                            so 1 is the smallest factor any set of numbers can share. If you
                            searched for that term, you almost certainly want either the LCM
                            (this page) or the{' '}
                            <Link href="/gcf-calculator/">greatest common factor</Link>.
                        </p>

                        <h2>Method 1 — Listing multiples</h2>
                        <p>
                            The most direct method: write out multiples of each number until you
                            find one they share.
                        </p>
                        <p>
                            <strong>Worked example — LCM of 4 and 6:</strong>
                        </p>
                        <ul>
                            <li>Multiples of 4: 4, 8, 12, 16, 20, 24, …</li>
                            <li>Multiples of 6: 6, 12, 18, 24, 30, …</li>
                            <li>Shared multiples: 12, 24, …</li>
                        </ul>
                        <p>
                            The smallest shared multiple is <strong>12</strong>, so LCM(4, 6) = 12.
                        </p>
                        <p>
                            This method is clear for small numbers, but it becomes impractical
                            fast — for 48 and 60 you would need to list 20 multiples before
                            finding 240.
                        </p>

                        <h2>Method 2 — Prime factorization</h2>
                        <p>
                            Break each number into primes, then take the{' '}
                            <strong>highest power</strong> of every prime that appears anywhere.
                        </p>
                        <p>
                            <strong>Worked example — LCM of 12 and 18:</strong>
                        </p>
                        <ul>
                            <li>12 = 2² × 3</li>
                            <li>18 = 2 × 3²</li>
                            <li>Highest power of 2: 2² (from 12)</li>
                            <li>Highest power of 3: 3² (from 18)</li>
                        </ul>
                        <p>
                            LCM = 2² × 3² = 4 × 9 = <strong>36</strong>.
                        </p>
                        <p>
                            Notice the contrast with the GCF, where you take the <em>lowest</em>{' '}
                            power of shared primes instead. Use the{' '}
                            <Link href="/prime-factorization/">prime factorization calculator</Link>{' '}
                            to factorize any number.
                        </p>

                        <h2>Method 3 — The GCF formula</h2>
                        <p>
                            For two numbers, this is the fastest approach:
                        </p>
                        <p>
                            <strong>LCM(a, b) = (a × b) ÷ GCF(a, b)</strong>
                        </p>
                        <p>
                            <strong>Worked example — LCM of 48 and 60:</strong>
                        </p>
                        <ul>
                            <li>GCF(48, 60) = 12</li>
                            <li>48 × 60 = 2880</li>
                            <li>2880 ÷ 12 = 240</li>
                        </ul>
                        <p>
                            So LCM(48, 60) = <strong>240</strong>. Compare that to listing 20
                            multiples of 48 by hand.
                        </p>
                        <p>
                            This formula works only for pairs. For three or more numbers, apply it
                            step by step: find the LCM of the first two, then combine that result
                            with the next number.
                        </p>

                        <h2>Adding fractions with the LCM</h2>
                        <p>
                            The most common school use of the LCM is finding the{' '}
                            <strong>least common denominator</strong> when adding fractions.
                        </p>
                        <p>
                            <strong>Worked example — 1/4 + 1/6:</strong>
                        </p>
                        <ul>
                            <li>LCM(4, 6) = 12, so 12 is the least common denominator</li>
                            <li>1/4 = 3/12</li>
                            <li>1/6 = 2/12</li>
                            <li>3/12 + 2/12 = 5/12</li>
                        </ul>
                        <p>
                            Using the LCM rather than just multiplying denominators (which would
                            give 24) keeps the numbers smaller and the answer already close to
                            simplest form.
                        </p>

                        <h2>Where the LCM is used</h2>
                        <ul>
                            <li>
                                <strong>Adding fractions:</strong> the least common denominator is
                                the LCM of the denominators.
                            </li>
                            <li>
                                <strong>Scheduling:</strong> if one bus comes every 12 minutes and
                                another every 18, they arrive together every LCM(12, 18) = 36
                                minutes.
                            </li>
                            <li>
                                <strong>Gears and cycles:</strong> the LCM tells you when two
                                rotating parts return to their starting alignment.
                            </li>
                            <li>
                                <strong>Tiling and packing:</strong> the LCM gives the smallest
                                square that can be tiled evenly by two different rectangle sizes.
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
            url: 'https://mathworld.wolfram.com/LeastCommonMultiple.html',
            label: 'Wolfram MathWorld — Least Common Multiple',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Least_common_multiple',
            label: 'Wikipedia — Least Common Multiple',
        },
        {
            url: 'https://en.wikipedia.org/wiki/Lowest_common_denominator',
            label: 'Wikipedia — Lowest Common Denominator',
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