import Link from 'next/link';
import FactorTree from './FactorTree';

/**
 * Renders the content sections of a /factors-of-N/ page.
 * All values are precomputed on the server — this is a server component,
 * so these pages ship almost no JavaScript.
 */
export default function NumberPageContent({ facts, notes }) {
    const f = facts;
    const { n } = f;

    return (
        <>
            {/* All factors */}
            <section className="mt-10">
                <h2 className="mt-0">All factors of {n}</h2>
                <p>
                    {n === 1
                        ? 'The number 1 has a single factor.'
                        : `Here are all ${f.factorCount} factors of ${n}, listed from smallest to largest.`}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {f.factors.map((d) => (
                        <span
                            key={d}
                            className="px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-sm font-mono font-semibold text-brand-800"
                        >
                            {d}
                        </span>
                    ))}
                </div>
            </section>

            {/* Factor pairs */}
            {f.pairs.length > 0 && n > 1 && (
                <section className="mt-10">
                    <h2 className="mt-0">Factor pairs of {n}</h2>
                    <p>
                        {f.pairs.length === 1
                            ? `There is only one factor pair for ${n}, because it is prime.`
                            : `These ${f.pairs.length} pairs of whole numbers each multiply to give ${n}.`}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {f.pairs.map(([a, b], i) => (
                            <div
                                key={i}
                                className="bg-white border border-surface-border rounded-lg px-4 py-2.5 text-sm font-mono text-ink"
                            >
                                {a} × {b} = {n}
                            </div>
                        ))}
                    </div>
                    {f.square && (
                        <p className="text-sm text-ink-muted mt-3">
                            Notice the pair ({f.sqrt}, {f.sqrt}) — because {n} is a perfect
                            square, this pair uses the same number twice.
                        </p>
                    )}
                </section>
            )}

            {/* Prime factorization */}
            {n > 1 && (
                <section className="mt-10">
                    <h2 className="mt-0">Prime factorization of {n}</h2>
                    {f.prime ? (
                        <p>
                            {n} is a prime number, so it cannot be broken down further. Its prime
                            factorization is simply <strong>{n}</strong>.
                        </p>
                    ) : (
                        <>
                            <p>
                                Dividing {n} by the smallest prime at each step gives its prime
                                factorization:
                            </p>
                            <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto mt-4">
                                {buildDivisionSteps(n, f.primesList).map((s, i) => (
                                    <div key={i} className="py-0.5">
                                        {s}
                                    </div>
                                ))}
                                <div className="mt-3 pt-3 border-t border-surface-border">
                                    <strong className="font-sans">Result:</strong> {n} ={' '}
                                    {f.primesList.join(' × ')} ={' '}
                                    <span className="text-brand-700">{f.primeFormatted}</span>
                                </div>
                            </div>
                            <p className="mt-4">
                                The distinct prime factors of {n} are{' '}
                                <strong>{f.distinctPrimes.join(', ')}</strong>. To factorize any
                                other number, use the{' '}
                                <Link href="/prime-factorization/">
                                    prime factorization calculator
                                </Link>
                                .
                            </p>
                        </>
                    )}
                </section>
            )}

            {/* Factor tree */}
            {!f.prime && n > 1 && (
                <section className="mt-10">
                    <h2 className="mt-0">Factor tree of {n}</h2>
                    <p>
                        A factor tree shows the same prime factorization visually. Each
                        composite branch splits until every endpoint is a prime number.
                    </p>
                    <FactorTree n={n} />
                </section>
            )}

            {/* Properties table */}
            <section className="mt-10">
                <h2 className="mt-0">Properties of {n}</h2>
                <div className="overflow-x-auto">
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    Number of factors
                                </th>
                                <td>{f.factorCount}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of factors</th>
                                <td>{f.divisorSum}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of proper factors</th>
                                <td>{f.aliquot}</td>
                            </tr>
                            <tr>
                                <th scope="row">Prime factorization</th>
                                <td className="font-mono">{n === 1 ? '—' : f.primeFormatted}</td>
                            </tr>
                            <tr>
                                <th scope="row">Prime or composite?</th>
                                <td>{n === 1 ? 'Neither (unit)' : f.prime ? 'Prime' : 'Composite'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Even or odd?</th>
                                <td>{f.even ? 'Even' : 'Odd'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Perfect square?</th>
                                <td>{f.square ? `Yes (${f.sqrt}²)` : 'No'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Perfect cube?</th>
                                <td>{f.cube ? `Yes (${f.cbrt}³)` : 'No'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Classification</th>
                                <td>
                                    {n === 1
                                        ? 'Unit'
                                        : f.perfect
                                            ? 'Perfect'
                                            : f.abundant
                                                ? 'Abundant'
                                                : 'Deficient'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Number-specific notes */}
            {notes.length > 0 && (
                <section className="mt-10">
                    <h2 className="mt-0">What makes {n} interesting</h2>
                    <ul>
                        {notes.map((note, i) => (
                            <li key={i}>{note}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* How to find */}
            {n > 1 && (
                <section className="mt-10">
                    <h2 className="mt-0">How to find the factors of {n} yourself</h2>
                    <p>
                        Divide {n} by each whole number starting from 1. Whenever the division
                        leaves no remainder, both the divisor and the quotient are factors. You
                        only need to test up to √{n} ≈ {Math.sqrt(n).toFixed(2)}, because every
                        factor above that pairs with one below it.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto mt-4">
                        {f.pairs.map(([a, b], i) => (
                            <div key={i} className="py-0.5">
                                {n} ÷ {a} = {b} ✓
                            </div>
                        ))}
                    </div>
                    <p className="mt-4">
                        Reading both columns gives every factor:{' '}
                        <strong>{f.factors.join(', ')}</strong>. The{' '}
                        <Link href="/">factor calculator</Link> does this automatically for any
                        number.
                    </p>
                </section>
            )}
        </>
    );
}

/** Build the division ladder lines for display. */
function buildDivisionSteps(n, primes) {
    const lines = [];
    let current = n;
    for (const p of primes) {
        const next = current / p;
        lines.push(`${current} ÷ ${p} = ${next}`);
        current = next;
    }
    return lines;
}