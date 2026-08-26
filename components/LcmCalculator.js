'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    getLCM,
    getGCF,
    getPrimeFactorization,
    formatPrimeFactorization,
} from '../lib/factorMath';

const MAX_INPUTS = 5;
const MAX_VALUE = 1000000000;

export default function LcmCalculator({ initialValues = [12, 18] }) {
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
                            Least common multiple
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
                            <label htmlFor={`lcm-${i}`} className="sr-only">
                                Number {i + 1}
                            </label>
                            <input
                                id={`lcm-${i}`}
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
                            const lcm = getLCM(parsed.numbers);
                            copyToClipboard(`LCM(${parsed.numbers.join(', ')}) = ${lcm}`);
                            showToast('Result copied');
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
        return {
            error: 'Enter at least two numbers to find their least common multiple.',
        };
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
                    'The LCM is undefined when one of the numbers is 0, because 0 has no positive multiples.',
            };
        }
        if (v > MAX_VALUE) {
            return {
                error: 'Numbers must be one billion or less so the LCM stays computable.',
            };
        }
        numbers.push(v);
    }

    // Guard against LCM overflow beyond safe integers
    const lcm = getLCM(numbers);
    if (!Number.isSafeInteger(lcm)) {
        return {
            error:
                'The least common multiple of these numbers is too large to display accurately. Try smaller values.',
        };
    }

    return { numbers };
}

function InlineAnswer({ numbers }) {
    const lcm = getLCM(numbers);

    return (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                Least common multiple
            </p>
            <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                LCM({numbers.join(', ')}) = {formatNumber(lcm)}
            </p>
            <div className="result-value font-mono text-sm text-ink">
                {formatNumber(lcm)} is the smallest number that {numbers.join(', ')}{' '}
                all divide into evenly.
            </div>
        </div>
    );
}

function Details({ numbers }) {
    const lcm = getLCM(numbers);
    const gcf = getGCF(numbers);
    const primeTable = useMemo(() => buildPrimeTable(numbers), [numbers]);
    const isPair = numbers.length === 2;

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Results summary</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    Least common multiple (LCM)
                                </th>
                                <td className="font-semibold text-brand-700">{formatNumber(lcm)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Greatest common factor (GCF)</th>
                                <td>{gcf}</td>
                            </tr>
                            {numbers.map((n, i) => (
                                <tr key={i}>
                                    <th scope="row">LCM ÷ {formatNumber(n)}</th>
                                    <td>{formatNumber(lcm / n)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Method 1 — Prime factorization</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    Factorize each number, then take the highest power of every prime that
                    appears in any of them.
                </p>
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
                                <td className="font-semibold text-brand-700">LCM</td>
                                <td className="font-mono text-brand-700">
                                    {formatPrimeFactorization(lcm)} = {formatNumber(lcm)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {primeTable.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-ink-soft mb-2">
                            Highest power of each prime:
                        </p>
                        <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                            {primeTable.map((row, i) => (
                                <div key={i} className="py-0.5">
                                    Prime {row.prime}: highest power is {row.prime}
                                    {row.maxExp > 1 ? `^${row.maxExp}` : ''} ={' '}
                                    {Math.pow(row.prime, row.maxExp)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {isPair && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Method 2 — Using the GCF formula</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        For two numbers, the LCM can be found directly from the GCF.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="py-0.5">LCM(a, b) = (a × b) ÷ GCF(a, b)</div>
                        <div className="py-0.5">
                            LCM({numbers[0]}, {numbers[1]}) = ({numbers[0]} × {numbers[1]}) ÷{' '}
                            {gcf}
                        </div>
                        <div className="py-0.5">
                            = {formatNumber(numbers[0] * numbers[1])} ÷ {gcf}
                        </div>
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">Result:</strong>{' '}
                            <span className="text-brand-700">LCM = {formatNumber(lcm)}</span>
                        </div>
                    </div>
                </section>
            )}

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Method 3 — Listing multiples</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    Write out the multiples of each number and find the first value they all
                    share.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>First multiples</th>
                            </tr>
                        </thead>
                        <tbody>
                            {numbers.map((n, i) => (
                                <tr key={i}>
                                    <td className="font-semibold align-top">{formatNumber(n)}</td>
                                    <td className="font-mono">{listMultiples(n, lcm)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-ink-soft mt-3">
                    The first multiple shared by all of them is{' '}
                    <strong>{formatNumber(lcm)}</strong>.
                </p>
            </section>
        </div>
    );
}

/** Highest exponent of each prime across all inputs. */
function buildPrimeTable(numbers) {
    const maxExp = new Map();

    for (const n of numbers) {
        for (const [p, e] of getPrimeFactorization(n)) {
            const current = maxExp.get(p) || 0;
            if (e > current) maxExp.set(p, e);
        }
    }

    return Array.from(maxExp.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([prime, exp]) => ({ prime, maxExp: exp }));
}

/**
 * List multiples of n up to and including the LCM.
 * Caps output so very large LCMs don't produce huge strings.
 */
function listMultiples(n, lcm) {
    const count = lcm / n;
    const cap = 12;

    if (count <= cap) {
        const list = [];
        for (let i = 1; i <= count; i++) list.push(formatNumber(n * i));
        return list.join(', ');
    }

    const head = [];
    for (let i = 1; i <= 6; i++) head.push(formatNumber(n * i));
    return `${head.join(', ')}, …, ${formatNumber(lcm)}`;
}

function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}