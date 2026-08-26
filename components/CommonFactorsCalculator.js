'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    getGCF,
    getFactors,
    getCommonFactors,
    formatPrimeFactorization,
    isPrime,
} from '../lib/factorMath';

const MAX_INPUTS = 4;
const MAX_VALUE = 1000000000000;

export default function CommonFactorsCalculator({ initialValues = [36, 60] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton initialValues={initialValues} />;
    }

    return <Interactive initialValues={initialValues} />;
}

function Skeleton({ initialValues }) {
    return (
        <div className="w-full">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink m-0 mb-2">
                    Enter two or more numbers
                </p>
                <div className="flex flex-wrap gap-2">
                    {initialValues.map((v, i) => (
                        <input
                            key={i}
                            type="text"
                            defaultValue={String(v)}
                            readOnly
                            aria-label={`Number ${i + 1}`}
                            className="w-24 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg bg-white"
                        />
                    ))}
                </div>
                <div className="mt-3">
                    <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                            Common factors
                        </p>
                        <p className="mt-1 mb-0 text-sm text-ink-muted">Loading calculator…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Interactive({ initialValues }) {
    const [inputs, setInputs] = useState(initialValues.map((v) => String(v)));
    const [toast, setToast] = useState('');
    const toastTimer = useRef(null);

    useEffect(() => {
        return () => {
            if (toastTimer.current) clearTimeout(toastTimer.current);
        };
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 2000);
    };

    const parsed = useMemo(() => parseInputs(inputs), [inputs]);

    const setAt = (i, val) => {
        setInputs((prev) => prev.map((v, idx) => (idx === i ? val : v)));
    };

    const addInput = () => {
        if (inputs.length < MAX_INPUTS) setInputs((prev) => [...prev, '']);
    };

    const removeInput = (i) => {
        if (inputs.length > 2) setInputs((prev) => prev.filter((_, idx) => idx !== i));
    };

    return (
        <div className="w-full">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink m-0 mb-2">
                    Enter two or more numbers
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    {inputs.map((val, i) => (
                        <div key={i} className="relative">
                            <label htmlFor={`cf-${i}`} className="sr-only">
                                Number {i + 1}
                            </label>
                            <input
                                id={`cf-${i}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                value={val}
                                onChange={(e) => setAt(i, e.target.value)}
                                placeholder="0"
                                className="w-24 px-3 py-2.5 text-lg font-semibold text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white"
                            />
                            {inputs.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeInput(i)}
                                    aria-label={`Remove number ${i + 1}`}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-surface-alt hover:bg-danger hover:text-white text-ink-muted text-xs flex items-center justify-center border border-surface-border"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    {inputs.length < MAX_INPUTS && (
                        <button
                            type="button"
                            onClick={addInput}
                            className="btn btn-secondary text-sm px-3 py-2.5"
                        >
                            + Add
                        </button>
                    )}
                </div>

                <div aria-live="polite" aria-atomic="true" className="mt-3">
                    {parsed.error ? (
                        <div
                            role="alert"
                            className="p-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-900"
                        >
                            <p className="m-0 text-sm">{parsed.error}</p>
                        </div>
                    ) : (
                        <InlineAnswer numbers={parsed.numbers} />
                    )}
                </div>
            </div>

            {!parsed.error && (
                <div className="flex flex-wrap gap-2 mt-3 no-print">
                    <button
                        type="button"
                        onClick={() => {
                            const common = getCommonFactors(parsed.numbers);
                            copyToClipboard(
                                `Common factors of ${parsed.numbers.join(', ')}: ${common.join(', ')}`
                            );
                            showToast('Common factors copied');
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

            {!parsed.error && <Details numbers={parsed.numbers} />}

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

function parseInputs(inputs) {
    const cleaned = inputs.map((s) => String(s).trim()).filter((s) => s !== '');

    if (cleaned.length < 2) {
        return { error: 'Enter at least two numbers to find their common factors.' };
    }

    const numbers = [];
    for (const s of cleaned) {
        if (!/^-?\d+$/.test(s)) {
            return {
                error: 'Please enter whole numbers only (digits, no decimals or letters).',
            };
        }
        const v = Math.abs(Number(s));
        if (v === 0) {
            return {
                error:
                    'Enter positive whole numbers. Every number divides 0, so common factors are undefined here.',
            };
        }
        if (v > MAX_VALUE) {
            return { error: 'Numbers must be one trillion or less.' };
        }
        numbers.push(v);
    }

    return { numbers };
}

function InlineAnswer({ numbers }) {
    const common = getCommonFactors(numbers);
    const gcf = getGCF(numbers);
    const isCoprime = gcf === 1;
    const list = joinList(numbers);

    return (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                Common factors
            </p>
            <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                {isCoprime
                    ? `${list} share only one common factor: 1.`
                    : `${list} have ${common.length} common factors.`}
            </p>
            <div className="result-value font-mono text-sm text-ink">
                {common.join(', ')}
            </div>
        </div>
    );
}

/** Join numbers in natural English: "8 and 15" / "24, 36, and 60". */
function joinList(numbers) {
    const parts = numbers.map((n) => formatNumber(n));
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}
function Details({ numbers }) {
    const common = getCommonFactors(numbers);
    const gcf = getGCF(numbers);
    const commonSum = common.reduce((a, b) => a + b, 0);
    const commonPrimes = common.filter((f) => isPrime(f));
    const isCoprime = gcf === 1;

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Common factor properties</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    All common factors
                                </th>
                                <td className="font-mono">{common.join(', ')}</td>
                            </tr>
                            <tr>
                                <th scope="row">How many common factors</th>
                                <td className="font-semibold text-brand-700">{common.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Greatest common factor (GCF)</th>
                                <td className="font-semibold text-brand-700">{gcf}</td>
                            </tr>
                            <tr>
                                <th scope="row">Smallest common factor</th>
                                <td>1 (always)</td>
                            </tr>
                            <tr>
                                <th scope="row">Sum of common factors</th>
                                <td>{formatNumber(commonSum)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Common prime factors</th>
                                <td>{commonPrimes.length > 0 ? commonPrimes.join(', ') : 'None'}</td>
                            </tr>
                            <tr>
                                <th scope="row">Coprime?</th>
                                <td>
                                    {isCoprime ? 'Yes — the only shared factor is 1' : 'No'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Side-by-side factor comparison</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    Shared factors are highlighted. Everything not highlighted belongs to
                    only one of the numbers.
                </p>
                <div className="space-y-4">
                    {numbers.map((n, idx) => {
                        const factors = getFactors(n);
                        return (
                            <div key={idx}>
                                <p className="text-sm font-semibold text-ink m-0 mb-2">
                                    Factors of {formatNumber(n)} ({factors.length} total)
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {factors.map((f) => {
                                        const shared = common.includes(f);
                                        return (
                                            <span
                                                key={f}
                                                className={`px-2.5 py-1 rounded text-sm font-mono ${shared
                                                    ? 'bg-brand-100 text-brand-800 font-semibold border border-brand-300'
                                                    : 'bg-surface-alt text-ink-muted border border-surface-border'
                                                    }`}
                                            >
                                                {formatNumber(f)}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Why these are the common factors</h2>
                <p className="text-sm text-ink-soft mt-0 mb-3">
                    Every common factor of a set of numbers is also a factor of their GCF.
                    That means once you know the GCF, the full list of common factors is
                    simply the factor list of the GCF.
                </p>
                <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <div className="py-0.5">
                        GCF({numbers.join(', ')}) = {gcf}
                    </div>
                    <div className="py-0.5">
                        Factors of {gcf} = {getFactors(gcf).join(', ')}
                    </div>
                    <div className="mt-3 pt-3 border-t border-surface-border">
                        <strong className="font-sans">Therefore:</strong>{' '}
                        <span className="text-brand-700">
                            common factors = {common.join(', ')}
                        </span>
                    </div>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Prime factorization view</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Prime factorization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {numbers.map((n, i) => (
                                <tr key={i}>
                                    <td className="font-semibold">{formatNumber(n)}</td>
                                    <td className="font-mono">{formatPrimeFactorization(n)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold text-brand-700">Shared (GCF)</td>
                                <td className="font-mono text-brand-700">
                                    {gcf === 1
                                        ? '1 (no shared primes)'
                                        : `${formatPrimeFactorization(gcf)} = ${gcf}`}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}