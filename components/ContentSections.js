import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

/**
 * Homepage content sections with smart-width layout.
 * - Reading sections: narrow (container-prose ~720px) for readability
 * - Visual sections (tables, grids, cards): full width (container-content ~1200px)
 *
 * Each section is a self-contained block that wraps itself in the right container.
 */
export default function ContentSections() {
    return (
        <>
            <WhatIsAFactor />
            <HowToFindFactors />
            <FactorsVsMultiples />
            <TypesOfNumbers />
            <RealWorldUses />
            <PopularNumbers />
            <OtherTools />
            <References />
        </>
    );
}

/* ============================================================
 * Reading section — NARROW
 * ============================================================ */
function WhatIsAFactor() {
    return (
        <div className="container-prose">
            <section className="mt-12">
                <h2 className="mt-0">What is a factor?</h2>
                <p>
                    A <strong>factor</strong> of a number is a whole number that divides it
                    exactly, leaving no remainder. Factors are the building blocks of
                    multiplication — for any given number, its factors are the values you
                    can multiply together to make it.
                </p>
                <p>
                    For example, the factors of <strong>12</strong> are{' '}
                    <strong>1, 2, 3, 4, 6, and 12</strong>, because each of these divides
                    12 evenly:
                </p>
                <ul>
                    <li>12 ÷ 1 = 12</li>
                    <li>12 ÷ 2 = 6</li>
                    <li>12 ÷ 3 = 4</li>
                    <li>12 ÷ 4 = 3</li>
                    <li>12 ÷ 6 = 2</li>
                    <li>12 ÷ 12 = 1</li>
                </ul>
                <p>
                    Every whole number greater than 1 has at least two factors: 1 and the
                    number itself. Numbers with exactly two factors are called{' '}
                    <strong>prime numbers</strong> (like 7, 11, 13), while numbers with
                    more than two factors are called <strong>composite numbers</strong>{' '}
                    (like 4, 6, 12).
                </p>
                <p>
                    In math, factors are also called <strong>divisors</strong> — the two
                    terms mean the same thing when we're talking about whole numbers.
                </p>
            </section>
        </div>
    );
}

/* ============================================================
 * Reading section — NARROW (4 methods)
 * ============================================================ */
function HowToFindFactors() {
    return (
        <div className="container-prose">
            <section className="mt-12">
                <h2 className="mt-0">How to find the factors of a number</h2>
                <p>
                    There are four common ways to find the factors of a number. Each method
                    works for any positive integer, but some are faster for large numbers.
                    You can try them all in the calculator above.
                </p>

                <h3>Method 1 — Division method</h3>
                <p>
                    The <strong>division method</strong> is the most direct way to find
                    factors: divide the number by every whole number from 1 upward, and
                    record every divisor that gives a remainder of 0.
                </p>
                <p>
                    <strong>Example:</strong> Finding the factors of 18.
                </p>
                <ul>
                    <li>18 ÷ 1 = 18 ✓</li>
                    <li>18 ÷ 2 = 9 ✓</li>
                    <li>18 ÷ 3 = 6 ✓</li>
                    <li>18 ÷ 4 = 4.5 ✗</li>
                    <li>18 ÷ 5 = 3.6 ✗</li>
                    <li>18 ÷ 6 = 3 ✓</li>
                    <li>18 ÷ 9 = 2 ✓</li>
                    <li>18 ÷ 18 = 1 ✓</li>
                </ul>
                <p>
                    Factors of 18: <strong>1, 2, 3, 6, 9, 18</strong>.
                </p>
                <p>
                    <strong>Shortcut:</strong> You only need to check up to the square root
                    of the number. For 18, the square root is about 4.24, so testing 1
                    through 4 is enough — every factor above √18 pairs with one below it.
                </p>

                <h3>Method 2 — Prime factorization</h3>
                <p>
                    <strong>Prime factorization</strong> breaks a number down into a
                    product of prime numbers. To do this, keep dividing by the smallest
                    prime that divides the number, until you reach 1.
                </p>
                <p>
                    <strong>Example:</strong> Prime factorization of 72.
                </p>
                <ul>
                    <li>72 ÷ 2 = 36</li>
                    <li>36 ÷ 2 = 18</li>
                    <li>18 ÷ 2 = 9</li>
                    <li>9 ÷ 3 = 3</li>
                    <li>3 ÷ 3 = 1</li>
                </ul>
                <p>
                    Prime factors: 2 × 2 × 2 × 3 × 3, or in exponent form:{' '}
                    <strong>2³ × 3²</strong>. This form is unique for every number — no
                    other combination of primes multiplies to 72.
                </p>
                <p>
                    Prime factorization is the foundation of many math topics, including
                    the greatest common factor (GCF), least common multiple (LCM), and
                    cryptography.
                </p>

                <h3>Method 3 — Factor pairs</h3>
                <p>
                    A <strong>factor pair</strong> is two numbers that multiply to give the
                    original number. Listing factor pairs is a fast way to write down all
                    factors at once.
                </p>
                <p>
                    <strong>Example:</strong> Factor pairs of 24.
                </p>
                <ul>
                    <li>1 × 24 = 24</li>
                    <li>2 × 12 = 24</li>
                    <li>3 × 8 = 24</li>
                    <li>4 × 6 = 24</li>
                </ul>
                <p>
                    Combining both sides: <strong>1, 2, 3, 4, 6, 8, 12, 24</strong> — the
                    eight factors of 24. Perfect squares like 36 have a middle pair where
                    both numbers are the same (6 × 6 = 36).
                </p>

                <h3>Method 4 — Factor tree</h3>
                <p>
                    A <strong>factor tree</strong> is a visual way to see prime
                    factorization. You start with the number at the top, split it into two
                    factors, then keep splitting each composite factor until every leaf is
                    prime.
                </p>
                <p>
                    <strong>Example:</strong> Factor tree of 36.
                </p>
                <ul>
                    <li>36 splits into 2 × 18</li>
                    <li>18 splits into 2 × 9</li>
                    <li>9 splits into 3 × 3</li>
                </ul>
                <p>
                    The prime leaves are 2, 2, 3, 3 — giving 36 = 2² × 3². The calculator
                    above draws a factor tree automatically for any composite number.
                </p>
            </section>
        </div>
    );
}

/* ============================================================
 * Table section — FULL WIDTH
 * ============================================================ */
function FactorsVsMultiples() {
    return (
        <div className="container-content">
            <section className="mt-12">
                {/* Heading + intro stay narrow inside a full-width wrapper for readability */}
                <div className="max-w-prose-wide mx-auto">
                    <h2 className="mt-0">Factors vs multiples vs prime factors</h2>
                    <p>
                        These three terms are related but mean different things. This table
                        summarizes the difference using the number 12 as an example.
                    </p>
                </div>
                {/* Table gets full width */}
                <div className="overflow-x-auto mt-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Term</th>
                                <th>Meaning</th>
                                <th>Example (for 12)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Factor</strong></td>
                                <td>A whole number that divides the given number exactly.</td>
                                <td>1, 2, 3, 4, 6, 12</td>
                            </tr>
                            <tr>
                                <td><strong>Prime factor</strong></td>
                                <td>A factor that is also a prime number.</td>
                                <td>2, 3</td>
                            </tr>
                            <tr>
                                <td><strong>Multiple</strong></td>
                                <td>A number obtained by multiplying the given number by an integer.</td>
                                <td>12, 24, 36, 48, 60, …</td>
                            </tr>
                            <tr>
                                <td><strong>Divisor</strong></td>
                                <td>Another word for factor (used in the same way).</td>
                                <td>1, 2, 3, 4, 6, 12</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="max-w-prose-wide mx-auto">
                    <p className="text-sm text-ink-muted mt-3">
                        Rule of thumb: factors are always <em>less than or equal</em> to the
                        number; multiples are always <em>greater than or equal</em> to it.
                    </p>
                </div>
            </section>
        </div>
    );
}

/* ============================================================
 * Table section — FULL WIDTH
 * ============================================================ */
function TypesOfNumbers() {
    return (
        <div className="container-content">
            <section className="mt-12">
                <div className="max-w-prose-wide mx-auto">
                    <h2 className="mt-0">Types of numbers based on their factors</h2>
                    <p>
                        Numbers can be classified by how many factors they have and how those
                        factors add up. The calculator above shows all of these properties
                        automatically for any input.
                    </p>
                </div>
                <div className="overflow-x-auto mt-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Definition</th>
                                <th>Examples</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Prime</strong></td>
                                <td>Exactly two factors: 1 and itself.</td>
                                <td>2, 3, 5, 7, 11, 13, 17, 19, 23, 29</td>
                            </tr>
                            <tr>
                                <td><strong>Composite</strong></td>
                                <td>More than two factors.</td>
                                <td>4, 6, 8, 9, 10, 12, 14, 15, 16, 18</td>
                            </tr>
                            <tr>
                                <td><strong>Perfect</strong></td>
                                <td>The sum of its proper factors equals the number itself. Very rare.</td>
                                <td>6, 28, 496, 8128</td>
                            </tr>
                            <tr>
                                <td><strong>Abundant</strong></td>
                                <td>The sum of its proper factors is greater than the number.</td>
                                <td>12, 18, 20, 24, 30, 36</td>
                            </tr>
                            <tr>
                                <td><strong>Deficient</strong></td>
                                <td>The sum of its proper factors is less than the number.</td>
                                <td>1, 2, 3, 4, 5, 7, 8, 9, 10, 11</td>
                            </tr>
                            <tr>
                                <td><strong>Perfect square</strong></td>
                                <td>Product of an integer with itself.</td>
                                <td>1, 4, 9, 16, 25, 36, 49, 64, 81, 100</td>
                            </tr>
                            <tr>
                                <td><strong>Perfect cube</strong></td>
                                <td>Product of an integer with itself three times.</td>
                                <td>1, 8, 27, 64, 125, 216, 343, 512, 729, 1000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

/* ============================================================
 * Reading section — NARROW
 * ============================================================ */
function RealWorldUses() {
    return (
        <div className="container-prose">
            <section className="mt-12">
                <h2 className="mt-0">Why do we need factors? Real-world uses</h2>
                <p>
                    Finding factors of a number isn't just a classroom exercise — it's used
                    in many practical fields. Here are the most common applications.
                </p>
                <ul>
                    <li>
                        <strong>Simplifying fractions:</strong> Dividing the numerator and
                        denominator by their greatest common factor gives the fraction in
                        simplest form. For example, 18/24 simplifies to 3/4 by dividing both
                        by their GCF (6).
                    </li>
                    <li>
                        <strong>Least common multiple (LCM):</strong> Used to add or subtract
                        fractions with different denominators, and to solve scheduling
                        problems (e.g., two events repeating every N and M days).
                    </li>
                    <li>
                        <strong>Cryptography:</strong> Modern encryption like RSA depends on
                        the difficulty of finding the prime factors of very large numbers.
                        Prime factorization is the foundation of digital security.
                    </li>
                    <li>
                        <strong>Divisibility problems:</strong> Testing whether one number
                        divides another, which is used in everything from computer science
                        to accounting.
                    </li>
                    <li>
                        <strong>Grouping and arrangement:</strong> If you have 24 items and
                        want to arrange them into equal rows, the factors of 24 tell you all
                        the possible row/column combinations: 1×24, 2×12, 3×8, 4×6.
                    </li>
                    <li>
                        <strong>Algebra and number theory:</strong> Factoring is the
                        foundation for solving equations, understanding modular arithmetic,
                        and studying number patterns.
                    </li>
                </ul>
            </section>
        </div>
    );
}

/* ============================================================
 * Grid section — FULL WIDTH (40 cards, wider = more per row)
 * ============================================================ */
function PopularNumbers() {
    const numbers = siteConfig.popularNumbers;

    return (
        <div className="container-content">
            <section className="mt-12">
                <div className="max-w-prose-wide mx-auto">
                    <h2 className="mt-0">Popular factor lookups</h2>
                    <p>
                        Skip typing and jump straight to the factors, prime factorization,
                        factor pairs, and factor tree of these commonly searched numbers.
                    </p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 list-none pl-0 mt-4">
                    {numbers.map((n) => (
                        <li key={n} className="m-0">
                            <Link
                                href={`/factors-of-${n}/`}
                                className="block px-3 py-2 bg-white border border-surface-border rounded-lg text-center text-sm font-medium text-ink no-underline hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                            >
                                Factors of {n}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

/* ============================================================
 * Cards section — FULL WIDTH (3 cards per row on desktop)
 * ============================================================ */
function OtherTools() {
    const tools = [
        {
            href: '/prime-factorization/',
            title: 'Prime Factorization Calculator',
            desc: 'Break any number into its prime factors with step-by-step working and factor tree.',
        },
        {
            href: '/gcf-calculator/',
            title: 'GCF Calculator (HCF)',
            desc: 'Find the greatest common factor of two or more numbers using the Euclidean algorithm.',
        },
        {
            href: '/lcm-calculator/',
            title: 'LCM Calculator',
            desc: 'Calculate the least common multiple of two or more numbers.',
        },
        {
            href: '/common-factors/',
            title: 'Common Factors Calculator',
            desc: 'List every common factor of two numbers — not just the greatest one.',
        },
        {
            href: '/divisors/',
            title: 'Divisor Calculator',
            desc: 'Explore divisors and their properties: divisor count, sum, aliquot sum, and more.',
        },
    ];

    return (
        <div className="container-content">
            <section className="mt-12">
                <div className="max-w-prose-wide mx-auto">
                    <h2 className="mt-0">Other factor tools</h2>
                    <p>
                        Explore our other free math tools built with the same clean, fast,
                        step-by-step approach.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {tools.map((t) => (
                        <Link
                            key={t.href}
                            href={t.href}
                            className="block p-5 bg-white border border-surface-border rounded-xl hover:border-brand-300 hover:shadow-md transition-all no-underline group"
                        >
                            <h3 className="text-lg font-semibold text-ink mt-0 mb-1 group-hover:text-brand-700">
                                {t.title}
                            </h3>
                            <p className="text-sm text-ink-muted mt-0 mb-0">{t.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

/* ============================================================
 * References — NARROW
 * ============================================================ */
function References() {
    const refs = [
        { url: 'https://mathworld.wolfram.com/Divisor.html', label: 'Wolfram MathWorld — Divisor' },
        { url: 'https://en.wikipedia.org/wiki/Divisor', label: 'Wikipedia — Divisor (Factor)' },
        { url: 'https://oeis.org/A000005', label: 'OEIS A000005 — Number of divisors of n' },
        { url: 'https://oeis.org/A000203', label: 'OEIS A000203 — Sum of divisors of n' },
        { url: 'https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic', label: 'Wikipedia — Fundamental Theorem of Arithmetic' },
    ];

    return (
        <div className="container-prose">
            <section className="mt-12 pt-6 border-t border-surface-border">
                <h2 className="mt-0 text-lg">References</h2>
                <p className="text-sm text-ink-muted">
                    Definitions and mathematical properties used on this page follow
                    standard references:
                </p>
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
        </div>
    );
}