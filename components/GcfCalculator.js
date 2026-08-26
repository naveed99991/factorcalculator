'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    getGCF,
    getLCM,
    getFactors,
    formatPrimeFactorization,
    getCommonFactors,
} from '../lib/factorMath';

const MAX_INPUTS = 5;
const MAX_VALUE = 1000000000000;

export default function GcfCalculator({ initialValues = [48, 60] }) {
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
                            Greatest common factor
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
                            <label htmlFor={`gcf-${i}`} className="sr-only">
                                Number {i + 1}
                            </label>
                            <input
                                id={`gcf-${i}`}
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
                            const gcf = getGCF(parsed.numbers);
                            copyToClipboard(`GCF(${parsed.numbers.join(', ')}) = ${gcf}`);
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
            error: 'Enter at least two numbers to find their greatest common factor.',
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
                    'Enter positive whole numbers. Zero is divisible by every number, so the GCF is undefined here.',
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
    const gcf = getGCF(numbers);
    const isCoprime = gcf === 1;

    return (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                Greatest common factor
            </p>
            <p className="mt-1 mb-2 text-base sm:text-lg font-bold text-ink leading-snug">
                GCF({numbers.join(', ')}) = {gcf}
            </p>
            <div className="result-value font-mono text-sm text-ink">
                {isCoprime
                    ? 'These numbers are coprime — they share no common factor other than 1.'
                    : `The largest number that divides all of ${numbers.join(', ')} evenly is ${gcf}.`}
            </div>
        </div>
    );
}

function Details({ numbers }) {
    const gcf = getGCF(numbers);
    const lcm = getLCM(numbers);
    const commonFactors = getCommonFactors(numbers);
    const euclidSteps = useMemo(() => buildEuclideanSteps(numbers), [numbers]);

    return (
        <div>
            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Results summary</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <th scope="row" className="w-1/2">
                                    Greatest common factor (GCF)
                                </th>
                                <td className="font-semibold text-brand-700">{gcf}</td>
                            </tr>
                            <tr>
                                <th scope="row">All common factors</th>
                                <td>{commonFactors.join(', ')}</td>
                            </tr>
                            <tr>
                                <th scope="row">Number of common factors</th>
                                <td>{commonFactors.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Least common multiple (LCM)</th>
                                <td>{formatNumber(lcm)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Coprime?</th>
                                <td>{gcf === 1 ? 'Yes — no shared factors above 1' : 'No'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Method 1 — Prime factorization</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    Factorize each number, then take the lowest power of every prime they all
                    share.
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
                                <td className="font-semibold text-brand-700">GCF</td>
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

            {euclidSteps.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xl mt-0 mb-3">Method 2 — Euclidean algorithm</h2>
                    <p className="text-sm text-ink-muted mt-0 mb-3">
                        Repeatedly replace the larger number with the remainder of dividing it by
                        the smaller one. When the remainder hits 0, the last non-zero value is the
                        GCF.
                    </p>
                    <div className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        {euclidSteps.map((s, i) => (
                            <div
                                key={i}
                                className={
                                    s.isHeader
                                        ? 'font-sans font-semibold mt-3 first:mt-0'
                                        : 'py-0.5'
                                }
                            >
                                {s.text}
                            </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-surface-border">
                            <strong className="font-sans">Result:</strong>{' '}
                            <span className="text-brand-700">GCF = {gcf}</span>
                        </div>
                    </div>
                </section>
            )}

            <section className="mt-6">
                <h2 className="text-xl mt-0 mb-3">Method 3 — Listing factors</h2>
                <p className="text-sm text-ink-muted mt-0 mb-3">
                    List every factor of each number, then find the largest value that appears
                    in all lists.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Factors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {numbers.map((n, i) => (
                                <tr key={i}>
                                    <td className="font-semibold align-top">{formatNumber(n)}</td>
                                    <td className="font-mono">{getFactors(n).join(', ')}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold text-brand-700 align-top">Shared</td>
                                <td className="font-mono text-brand-700">
                                    {commonFactors.join(', ')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-ink-soft mt-3">
                    The largest shared factor is <strong>{gcf}</strong>.
                </p>
            </section>
        </div>
    );
}

function buildEuclideanSteps(numbers) {
    const steps = [];
    let running = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        let a = Math.max(running, numbers[i]);
        let b = Math.min(running, numbers[i]);

        if (numbers.length > 2) {
            steps.push({
                isHeader: true,
                text: `Step ${i}: GCF(${running}, ${numbers[i]})`,
            });
        }

        let guard = 0;
        while (b !== 0 && guard < 200) {
            const r = a % b;
            steps.push({ text: `${a} = ${b} × ${Math.floor(a / b)} + ${r}` });
            a = b;
            b = r;
            guard++;
        }
        steps.push({ text: `→ GCF so far: ${a}` });
        running = a;
    }

    return steps;
}

function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function copyToClipboard(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => { });
}