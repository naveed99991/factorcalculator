'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    normalizeInput,
    getFactors,
    getFactorPairs,
    getPrimeFactorization,
    formatPrimeFactorization,
    getDivisorSum,
    getAliquotSum,
    getDivisorCount,
    isPrime,
    isPerfect,
    isAbundant,
    isDeficient,
    isPerfectSquare,
    isPerfectCube,
    isEven,
} from '../lib/factorMath';

export default function DivisorCalculator({ initialValue = 120 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton initialValue={initialValue} />;
    }

    return <Interactive initialValue={initialValue} />;
}

function Skeleton({ initialValue }) {
    return (
        <div className="w-full">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        defaultValue={String(initialValue)}
                        readOnly
                        aria-label="Enter a number"
                        className="flex-1 min-w-0 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg bg-white"
                    />
                    <button type="button" className="btn btn-primary px-4 py-2.5 text-sm sm:text-base shrink-0">
                        Analyze
                    </button>
                </div>
                <div className="mt-3">
                    <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                            Divisors
                        </p>
                        <p className="mt-1 mb-0 text-sm text-ink-muted">Loading calculator…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Interactive({ initialValue }) {
    const [raw, setRaw] = useState(String(initialValue));
    const [debounced, setDebounced] = useState(String(initialValue));
    const [toast, setToast] = useState('');
    const toastTimer = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(raw), 200);
        return () => clearTimeout(t);
    }, [raw]);

    useEffect(() => {
        return () => {
            if (toastTimer.current) clearTimeout(toastTimer.current);
        };
    }, []);

    const result = useMemo(() => normalizeInput(debounced), [debounced]);
    const n = result.ok ? result.value : null;

    const showToast = (msg) => {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 2000);
    };

    return (
        <div className="w-full">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <label htmlFor="div-input" className="sr-only">
                        Enter a number
                    </label>
                    <input
                        id="div-input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder="Enter a number (e.g. 120)"
                        className="flex-1 min-w-0 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white"
                    />
                    <button
                        type="button"
                        onClick={() => setDebounced(raw)}
                        className="btn btn-primary px-4 py-2.5 text-sm sm:text-base shrink-0"
                    >
                        Analyze
                    </button>
                </div>

                <div aria-live="polite" aria-atomic="true" className="mt-3">
                    {!result.ok && result.kind !== 'empty' && (
                        <ValidationMessage kind={result.kind} message={result.message} />
                    )}
                    {!result.ok && result.kind === 'empty' && (
                        <p className="text-sm text-ink-muted m-0">
                            Enter any whole number up to one trillion to see its divisors and properties.
                        </p>
                    )}
                    {result.ok && <InlineAnswer n={n} note={result.note} />}
                </div>
            </div>

            {result.ok && (
                <div className="flex flex-wrap gap-2 mt-3 no-print">
                    <button
                        type="button"
                        onClick={() => {
                            copyToClipboard(getFactors(n).join(', '));
                            showToast('Divisors copied');
                        }}
                        className="btn btn-secondary text-sm"
                    >
                        Copy
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-secondary text-sm"
                    >
                        Print
                    </button>
                </div>
            )}

            {result.ok && <Details n={n} />}

            {toast && (
                <div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50"
                    role="status"
                >
                    {toast}
                </div>
            )}
        </div>
    );
}

function ValidationMessage({ kind, message }) {
    const isInfo = kind === 'zero' || kind === 'one' || kind === 'negative';
    return (
        <div
            role={isInfo ? 'status' : 'alert'}
            className={`p-3 rounded-lg border ${isInfo
                ? 'bg-brand-50 border-brand-200 text-brand-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
        >
            <p className="m-0 text-sm">{message}</p>
        </div>
    );
}

function InlineAnswer({ n, note }) {
    const divisors = useMemo(() => getFactors(n), [n]);
    const count = divisors.length;

    return (
        <div>
            {note && (
                <div className="mb-2 p-2 bg-brand-50 border border-brand-200 rounded text-xs text-brand-900">
                    {note}
                </div>
            )}
            <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                    Divisors
                </p>
                <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                    {formatNumber(n)} has {count} divisor{count === 1 ? '' : 's'}.
                </p>
                <div className="result-value font-mono text-sm text-ink">
                    {divisors.map((d) => formatNumber(d)).join(', ')}
                </div>
            </div>
        </div>
    );
}

function Details({ n }) {
    const divisors = useMemo(() => getFactors(n), [n]);
    const pairs = useMemo(() => getFactorPairs(n), [n]);
    const factorization = useMemo(() => getPrimeFactorization(n), [n]);
    const count = divisors.length;
    const sum = getDivisorSum(n);
    const aliquot = getAliquotSum(n);
    const properDivisors = divisors.slice(0, -1);
    const abundance = aliquot - n;

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Divisor properties of {formatNumber(n)}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    Number of divisors — d(n)
                                </th>
                                <td className="font-semibold text-brand-700">{count}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of divisors — σ(n)</th>
                                <td>{formatNumber(sum)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of proper divisors — s(n)</th>
                                <td>{formatNumber(aliquot)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Abundance — s(n) − n</th>
                                <td>
                                    {abundance > 0 ? '+' : ''}
                                    {formatNumber(abundance)}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Proper divisors</th>
                                <td className="font-mono">
                                    {properDivisors.length > 0
                                        ? properDivisors.map((d) => formatNumber(d)).join(', ')
                                        : 'None'}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Prime factorization</th>
                                <td className="font-mono">{formatPrimeFactorization(n)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Classification</h2>
                <div className="flex flex-wrap gap-2">
                    {buildTags(n).map((tag) => (
                        <span
                            key={tag.label}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${tag.highlight
                                ? 'bg-brand-100 text-brand-800 border-brand-300'
                                : 'bg-surface-alt text-ink-soft border-surface-border'
                                }`}
                            title={tag.title}
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-ink-soft mt-3">{describeClassification(n, aliquot)}</p>
            </section>

            {factorization.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">How the divisor count is calculated</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Add 1 to each exponent in the prime factorization, then multiply.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="py-0.5">
                            {formatNumber(n)} = {formatPrimeFactorization(n)}
                        </div>
                        <div className="py-0.5">
                            d(n) = {factorization.map(([, e]) => `(${e} + 1)`).join(' × ')}
                        </div>
                        <div className="py-0.5">
                            = {factorization.map(([, e]) => e + 1).join(' × ')}
                        </div>
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">Result:</strong>{' '}
                            <span className="text-brand-700">{count} divisors</span>
                        </div>
                    </div>
                </section>
            )}

            {factorization.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">How the divisor sum is calculated</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        For each prime power p<sup>e</sup>, the divisor sum contribution is
                        (p<sup>e+1</sup> − 1) ÷ (p − 1). Multiply the contributions together.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        {factorization.map(([p, e], i) => {
                            const contribution = (Math.pow(p, e + 1) - 1) / (p - 1);
                            return (
                                <div key={i} className="py-0.5">
                                    {p}^{e}: ({p}^{e + 1} − 1) ÷ ({p} − 1) ={' '}
                                    {formatNumber(Math.pow(p, e + 1) - 1)} ÷ {p - 1} ={' '}
                                    {formatNumber(contribution)}
                                </div>
                            );
                        })}
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">σ(n) =</strong>{' '}
                            {factorization
                                .map(([p, e]) => formatNumber((Math.pow(p, e + 1) - 1) / (p - 1)))
                                .join(' × ')}{' '}
                            = <span className="text-brand-700">{formatNumber(sum)}</span>
                        </div>
                    </div>
                </section>
            )}

            {pairs.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Divisor pairs</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Divisors always come in pairs that multiply to {formatNumber(n)}.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {pairs.map(([a, b], i) => (
                            <div
                                key={i}
                                className="bg-white border border-surface-border rounded-lg px-4 py-2 text-sm font-mono text-ink"
                            >
                                {formatNumber(a)} × {formatNumber(b)}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Divisibility checks</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    Which small numbers divide {formatNumber(n)} exactly.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((d) => {
                        const divides = n % d === 0;
                        return (
                            <div
                                key={d}
                                className={`px-3 py-2 rounded-lg text-sm text-center border ${divides
                                    ? 'bg-brand-50 text-brand-800 border-brand-200 font-semibold'
                                    : 'bg-surface-alt text-ink-faint border-surface-border'
                                    }`}
                            >
                                {divides ? '✓' : '✗'} by {d}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function buildTags(n) {
    const tags = [];

    if (n === 1) {
        return [{ label: 'Unit', highlight: true, title: 'Neither prime nor composite' }];
    }

    if (isPrime(n)) {
        tags.push({ label: 'Prime', highlight: true, title: 'Exactly two divisors' });
    } else {
        tags.push({ label: 'Composite', highlight: false, title: 'More than two divisors' });
    }

    tags.push({
        label: isEven(n) ? 'Even' : 'Odd',
        highlight: false,
        title: isEven(n) ? 'Divisible by 2' : 'Not divisible by 2',
    });

    if (isPerfect(n)) {
        tags.push({
            label: 'Perfect',
            highlight: true,
            title: 'Proper divisors sum to the number itself',
        });
    } else if (isAbundant(n)) {
        tags.push({
            label: 'Abundant',
            highlight: false,
            title: 'Proper divisors sum to more than the number',
        });
    } else if (isDeficient(n)) {
        tags.push({
            label: 'Deficient',
            highlight: false,
            title: 'Proper divisors sum to less than the number',
        });
    }

    if (isPerfectSquare(n)) {
        tags.push({
            label: 'Perfect square',
            highlight: true,
            title: 'An integer multiplied by itself',
        });
    }
    if (isPerfectCube(n)) {
        tags.push({
            label: 'Perfect cube',
            highlight: true,
            title: 'An integer multiplied by itself three times',
        });
    }

    return tags;
}

function describeClassification(n, aliquot) {
    if (n === 1) {
        return '1 is a unit — it has exactly one divisor and is neither prime nor composite.';
    }
    if (isPrime(n)) {
        return `${formatNumber(n)} is prime, so its only divisors are 1 and itself. All primes are deficient, since their proper divisors sum to just 1.`;
    }
    if (isPerfect(n)) {
        return `${formatNumber(n)} is a perfect number — its proper divisors add up to exactly ${formatNumber(n)}. Perfect numbers are extremely rare; only a handful are known.`;
    }
    if (isAbundant(n)) {
        return `${formatNumber(n)} is abundant — its proper divisors sum to ${formatNumber(aliquot)}, which is ${formatNumber(aliquot - n)} more than the number itself.`;
    }
    return `${formatNumber(n)} is deficient — its proper divisors sum to ${formatNumber(aliquot)}, which is ${formatNumber(n - aliquot)} less than the number itself.`;
}

function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}