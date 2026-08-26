'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    normalizeInput,
    getFactors,
    getFactorPairs,
    getPrimeFactorization,
    getPrimeFactorizationSteps,
    formatPrimeFactorization,
    getDivisorSum,
    getAliquotSum,
    getDistinctPrimeFactors,
    isPrime,
    isPerfect,
    isAbundant,
    isPerfectSquare,
    isPerfectCube,
    isEven,
} from '../lib/factorMath';
import FactorTree from './FactorTree';

/**
 * Interactive Factor Calculator (homepage).
 * Mount-gated so server HTML and first client render are identical.
 */
export default function FactorCalculator({ initialValue = 72 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <CalculatorSkeleton initialValue={initialValue} />;
    }

    return <InteractiveCalculator initialValue={initialValue} />;
}

function CalculatorSkeleton({ initialValue }) {
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
                    <button
                        type="button"
                        className="btn btn-primary px-4 py-2.5 text-sm sm:text-base shrink-0"
                    >
                        Calculate
                    </button>
                </div>
                <div className="mt-3">
                    <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                            Answer
                        </p>
                        <p className="mt-1 mb-0 text-sm text-ink-muted">Loading calculator…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InteractiveCalculator({ initialValue }) {
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
                    <label htmlFor="factor-input" className="sr-only">
                        Enter a number
                    </label>
                    <input
                        id="factor-input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder="Enter a number (e.g. 72)"
                        className="flex-1 min-w-0 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white"
                    />
                    <button
                        type="button"
                        onClick={() => setDebounced(raw)}
                        className="btn btn-primary px-4 py-2.5 text-sm sm:text-base shrink-0"
                    >
                        Calculate
                    </button>
                </div>

                <div aria-live="polite" aria-atomic="true" className="mt-3">
                    {!result.ok && result.kind !== 'empty' && (
                        <ValidationMessage kind={result.kind} message={result.message} />
                    )}
                    {!result.ok && result.kind === 'empty' && (
                        <p className="text-sm text-ink-muted m-0">
                            Enter any whole number up to one trillion. Results update as you type.
                        </p>
                    )}
                    {result.ok && <InlineAnswer n={n} note={result.note} />}
                </div>
            </div>

            {result.ok && (
                <ActionRow
                    n={n}
                    onCopy={(text, label) => {
                        copyToClipboard(text);
                        showToast(`${label} copied`);
                    }}
                    onShare={() => sharePage(n, showToast)}
                    onPrint={() => window.print()}
                />
            )}

            {result.ok && <ResultDetails n={n} />}

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
    const factors = useMemo(() => getFactors(n), [n]);
    const factorsCsv = factors.join(', ');
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
                    Answer
                </p>
                <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                    {n === 1
                        ? '1 has one factor: itself.'
                        : isPrimeN
                            ? `${n} is prime — factors: 1 and ${n}.`
                            : `${n} has ${factors.length} factors.`}
                </p>
                <div className="result-value font-mono text-sm text-ink">{factorsCsv}</div>
            </div>
        </div>
    );
}

function ActionRow({ n, onCopy, onShare, onPrint }) {
    const factors = getFactors(n).join(', ');
    return (
        <div className="flex flex-wrap gap-2 mt-3 no-print">
            <button
                type="button"
                onClick={() => onCopy(factors, 'Factors')}
                className="btn btn-secondary text-sm"
                aria-label="Copy factors to clipboard"
            >
                <IconCopy /> Copy
            </button>
            <button
                type="button"
                onClick={onShare}
                className="btn btn-secondary text-sm"
                aria-label="Share this result"
            >
                <IconShare /> Share
            </button>
            <button
                type="button"
                onClick={onPrint}
                className="btn btn-secondary text-sm"
                aria-label="Print this result"
            >
                <IconPrint /> Print
            </button>
        </div>
    );
}

function ResultDetails({ n }) {
    const factors = useMemo(() => getFactors(n), [n]);
    const factorPairs = useMemo(() => getFactorPairs(n), [n]);
    const primeFactorization = useMemo(() => getPrimeFactorization(n), [n]);
    const primeSteps = useMemo(() => getPrimeFactorizationSteps(n), [n]);
    const primeFormatted = formatPrimeFactorization(n);
    const divisorSum = getDivisorSum(n);
    const aliquotSum = getAliquotSum(n);
    const distinctPrimes = getDistinctPrimeFactors(n);
    const properties = useMemo(() => buildPropertiesList(n), [n]);
    const isPrimeN = isPrime(n);

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Quick facts about {n}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    Number of factors
                                </th>
                                <td>{factors.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of factors</th>
                                <td>{formatNumber(divisorSum)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of proper factors (aliquot sum)</th>
                                <td>{formatNumber(aliquotSum)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Prime factorization</th>
                                <td className="font-mono">{primeFormatted}</td>
                            </tr>
                            <tr>
                                <th scope="row">Distinct prime factors</th>
                                <td>{distinctPrimes.length > 0 ? distinctPrimes.join(', ') : '—'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Type</th>
                                <td>{properties.join(', ')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {factorPairs.length > 0 && !isPrimeN && n > 1 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Factor pairs of {n}</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Pairs of numbers whose product equals {n}.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {factorPairs.map(([a, b], i) => (
                            <div
                                key={i}
                                className="bg-white border border-surface-border rounded-lg px-4 py-2 text-sm font-mono text-ink"
                            >
                                {a} × {b} = {n}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!isPrimeN && n > 1 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Factor tree of {n}</h2>
                    <FactorTree n={n} />
                </section>
            )}

            {primeSteps.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Prime factorization — step by step</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Divide by the smallest prime possible at each step until the quotient is 1.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        {primeSteps.map((s, i) => (
                            <div key={i} className="py-0.5">
                                {s.dividend} ÷ {s.divisor} = {s.quotient}
                            </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">Result:</strong>{' '}
                            {primeFactorization
                                .map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`))
                                .join(' × ')}{' '}
                            = <span className="text-brand-700">{n}</span>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function buildPropertiesList(n) {
    const tags = [];
    if (n === 1) return ['Unit'];
    if (isPrime(n)) tags.push('Prime');
    else tags.push('Composite');
    tags.push(isEven(n) ? 'Even' : 'Odd');
    if (isPerfect(n)) tags.push('Perfect');
    else if (isAbundant(n)) tags.push('Abundant');
    else tags.push('Deficient');
    if (isPerfectSquare(n)) tags.push('Perfect square');
    if (isPerfectCube(n)) tags.push('Perfect cube');
    return tags;
}

function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}

function sharePage(n, showToast) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = `Factors of ${n}`;
    const text = `Find the factors of ${n} on Factor Calculator.`;

    if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title, text, url }).catch(() => { });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast('Link copied'));
    }
}

function IconCopy() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}
function IconShare() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}
function IconPrint() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
        </svg>
    );
}