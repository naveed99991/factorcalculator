'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseQuery, EXAMPLE_QUERIES } from '../lib/queryParser';

/**
 * Natural-language question box.
 * Mount-gated so server HTML and first client render match.
 */
export default function AskBox() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <Skeleton />;
    return <Interactive />;
}

function Skeleton() {
    return (
        <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-sm font-semibold text-ink m-0 mb-2">
                Ask a factor question in plain English
            </p>
            <div className="h-24 rounded-lg border-2 border-surface-border bg-surface-soft" />
            <p className="text-xs text-ink-muted mt-2 mb-0">Loading…</p>
        </div>
    );
}

function Interactive() {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [showSteps, setShowSteps] = useState(false);

    const run = (value) => {
        const q = typeof value === 'string' ? value : text;
        setResult(parseQuery(q));
        setShowSteps(false);
    };

    const useExample = (example) => {
        setText(example);
        setResult(parseQuery(example));
        setShowSteps(false);
    };

    return (
        <div className="w-full">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <label
                    htmlFor="ask-input"
                    className="block text-sm font-semibold text-ink mb-2"
                >
                    Ask a factor question in plain English
                </label>

                <textarea
                    id="ask-input"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run();
                    }}
                    placeholder="How many of these have a factor of 7? 17, 21, 26, 27, 35, 56, 77"
                    className="w-full px-3 py-2.5 text-base text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white resize-y"
                />

                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button
                        type="button"
                        onClick={() => run()}
                        className="btn btn-primary px-5 py-2.5"
                    >
                        Get answer
                    </button>
                    {text && (
                        <button
                            type="button"
                            onClick={() => {
                                setText('');
                                setResult(null);
                            }}
                            className="btn btn-secondary px-4 py-2.5 text-sm"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {result && (
                    <div className="mt-4" aria-live="polite">
                        {result.ok ? (
                            <AnswerCard
                                result={result}
                                showSteps={showSteps}
                                onToggleSteps={() => setShowSteps((s) => !s)}
                            />
                        ) : (
                            <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                                <p className="m-0 text-sm text-amber-900">{result.message}</p>
                                {result.suggestions && result.suggestions.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {result.suggestions.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => useExample(s)}
                                                className="px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-full text-amber-900 hover:bg-amber-100 text-left"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Examples */}
            <div className="mt-4">
                <p className="text-sm text-ink-muted m-0 mb-2">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_QUERIES.slice(0, 6).map((ex) => (
                        <button
                            key={ex}
                            type="button"
                            onClick={() => useExample(ex)}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-surface-alt hover:bg-brand-50 hover:text-brand-700 text-ink-soft border border-surface-border rounded-full transition-colors text-left"
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AnswerCard({ result, showSteps, onToggleSteps }) {
    return (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                Answer
            </p>
            <p className="mt-1 mb-0 text-base sm:text-lg font-bold text-ink leading-snug">
                {result.headline}
            </p>

            {result.detail && (
                <p className="mt-2 mb-0 text-sm text-ink-soft leading-relaxed">
                    {result.detail}
                </p>
            )}

            {result.steps.length > 0 && (
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={onToggleSteps}
                        className="text-sm text-brand-600 hover:text-brand-700 underline"
                    >
                        {showSteps ? 'Hide working' : 'Show working'}
                    </button>

                    {showSteps && (
                        <div className="mt-2 bg-white border border-brand-100 rounded-lg p-3 font-mono text-sm text-ink overflow-x-auto">
                            {result.steps.map((s, i) => (
                                <div key={i} className="py-0.5">
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {result.links.length > 0 && (
                <div className="mt-4 pt-3 border-t border-brand-100">
                    <p className="text-xs text-ink-muted m-0 mb-2">See the full working:</p>
                    <div className="flex flex-wrap gap-2">
                        {result.links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-sm px-3 py-1.5 bg-white border border-brand-200 rounded-lg no-underline text-brand-700 hover:bg-brand-50"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}