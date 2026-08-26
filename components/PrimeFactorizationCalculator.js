'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    normalizeInput,
    getPrimeFactorization,
    getPrimeFactorizationSteps,
    getPrimeFactorsList,
    getDistinctPrimeFactors,
    formatPrimeFactorization,
    getFactors,
    isPrime,
} from '../lib/factorMath';
import FactorTree from './FactorTree';

/**
 * Prime Factorization Calculator.
 * Mount-gated to avoid hydration mismatch (same pattern as FactorCalculator).
 */
export default function PrimeFactorizationCalculator({ initialValue = 360 }) {
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
                        Factorize
                    </button>
                </div>
                <div className="mt-3">
                    <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                            Prime factorization
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
                    <label htmlFor="pf-input" className="sr-only">
                        Enter a number
                    </label>
                    <input
                        id="pf-input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder="Enter a number (e.g. 360)"
                        className="flex-1 min-w-0 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white"
                    />
                    <button
                        type="button"
                        onClick={() => setDebounced(raw)}
                        className="btn btn-primary px-4 py-2.5 text-sm sm:text-base shrink-0"
                    >
                        Factorize
                    </button>
                </div>

                <div aria-live="polite" aria-atomic="true" className="mt-3">
                    {!result.ok && result.kind !== 'empty' && (
                        <ValidationMessage kind={result.kind} message={result.message} />
                    )}
                    {!result.ok && result.kind === 'empty' && (
                        <p className="text-sm text-ink-muted m-0">
                            Enter any whole number up to one trillion to see its prime factorization.
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
                            copyToClipboard(`${n} = ${formatPrimeFactorization(n)}`);
                            showToast('Factorization copied');
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
    const formatted = formatPrimeFactorization(n);
    const expanded = getPrimeFactorsList(n).join(' × ');
    const isPrimeN = isPrime(n);

    return (
        <div>
            {note && (
                <div className="mb-2 p-2 bg-brand-50 border border-brand-200 rounded text-xs text-brand-900">
                    {note}
                </div>
            )}
            <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                    Prime factorization
                </p>
                <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                    {n === 1
                        ? '1 has no prime factors.'
                        : isPrimeN
                            ? `${n} is already prime.`
                            : `${n} = ${formatted}`}
                </p>
                {n > 1 && !isPrimeN && (
                    <div className="result-value font-mono text-sm text-ink">
                        Expanded form: {n} = {expanded}
                    </div>
                )}
            </div>
        </div>
    );
}

function Details({ n }) {
    const factorization = useMemo(() => getPrimeFactorization(n), [n]);
    const steps = useMemo(() => getPrimeFactorizationSteps(n), [n]);
    const distinct = getDistinctPrimeFactors(n);
    const withMultiplicity = getPrimeFactorsList(n);
    const totalFactors = getFactors(n).length;
    const isPrimeN = isPrime(n);

    if (n < 2) return null;

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Prime factorization facts for {n}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">Exponent form</th>
                                <td className="font-mono">{formatPrimeFactorization(n)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Expanded form</th>
                                <td className="font-mono">{withMultiplicity.join(' × ')}</td>
                            </tr>
                            <tr>
                                <th scope="row">Distinct prime factors</th>
                                <td>{distinct.join(', ')}</td>
                            </tr>
                            <tr>
                                <th scope="row">Number of distinct primes</th>
                                <td>{distinct.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Total prime factors (with repeats)</th>
                                <td>{withMultiplicity.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Total divisors</th>
                                <td>{totalFactors}</td>
                            </tr>
                            <tr>
                                <th scope="row">Largest prime factor</th>
                                <td>{distinct[distinct.length - 1]}</td>
                            </tr>
                            <tr>
                                <th scope="row">Smallest prime factor</th>
                                <td>{distinct[0]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {steps.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Step-by-step division method</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Keep dividing by the smallest prime that divides evenly, until the quotient reaches 1.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        {steps.map((s, i) => (
                            <div key={i} className="py-0.5">
                                {s.dividend} ÷ {s.divisor} = {s.quotient}
                            </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">Result:</strong> {n} ={' '}
                            <span className="text-brand-700">
                                {factorization.map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join(' × ')}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {!isPrimeN && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Factor tree of {n}</h2>
                    <FactorTree n={n} />
                </section>
            )}

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">How the divisor count is derived</h2>
                <p className="text-sm text-ink-soft">
                    Once you know the prime factorization, you can count all divisors without
                    listing them. Add 1 to each exponent and multiply the results:
                </p>
                <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    {n} = {formatPrimeFactorization(n)}
                    <br />
                    Divisor count = {factorization.map(([, e]) => `(${e} + 1)`).join(' × ')} ={' '}
                    {factorization.map(([, e]) => e + 1).join(' × ')} ={' '}
                    <span className="text-brand-700">{totalFactors}</span>
                </div>
            </section>
        </div>
    );
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}