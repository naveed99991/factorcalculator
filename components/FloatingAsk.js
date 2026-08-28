'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { parseQuery, EXAMPLE_QUERIES } from '../lib/queryParser';

/**
 * Site-wide floating question widget.
 * Renders a bottom-right launcher; clicking it opens a compact ask panel.
 * Mount-gated so server HTML and first client render match.
 */
export default function FloatingAsk() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [showSteps, setShowSteps] = useState(false);
    const inputRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Focus the input when the panel opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    // Escape closes the panel
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    // Click outside closes the panel (desktop only — mobile uses the backdrop)
    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        // Delay so the opening click doesn't immediately close it
        const t = setTimeout(() => document.addEventListener('mousedown', onClick), 0);
        return () => {
            clearTimeout(t);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open]);

    if (!mounted) return null;

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

    const reset = () => {
        setText('');
        setResult(null);
        setShowSteps(false);
    };

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-ink/30 z-40 sm:hidden no-print"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Panel */}
            {open && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label="Ask a factor question"
                    className="fixed z-50 no-print
                     inset-x-3 bottom-3 max-h-[80vh]
                     sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[400px] sm:max-h-[70vh]
                     bg-white border border-surface-border rounded-2xl shadow-2xl
                     flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-brand-600 shrink-0">
                        <div>
                            <p className="m-0 text-sm font-semibold text-white">
                                Ask a factor question
                            </p>
                            <p className="m-0 text-xs text-brand-200">
                                Plain English, answered with working
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-brand-700 transition-colors shrink-0"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <textarea
                            ref={inputRef}
                            rows={2}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    run();
                                }
                            }}
                            placeholder="e.g. how many of these have a factor of 7? 21, 26, 35"
                            className="w-full px-3 py-2.5 text-sm text-ink border-2 border-surface-border rounded-lg focus:border-brand-500 focus:outline-none focus:ring-0 bg-white resize-none"
                        />

                        <div className="flex items-center gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => run()}
                                className="btn btn-primary px-4 py-2 text-sm"
                            >
                                Get answer
                            </button>
                            {(text || result) && (
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="btn btn-secondary px-3 py-2 text-sm"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {result && (
                            <div className="mt-3" aria-live="polite">
                                {result.ok ? (
                                    <CompactAnswer
                                        result={result}
                                        showSteps={showSteps}
                                        onToggleSteps={() => setShowSteps((s) => !s)}
                                        onClose={() => setOpen(false)}
                                    />
                                ) : (
                                    <div className="p-3 rounded-lg border bg-amber-50 border-amber-200">
                                        <p className="m-0 text-sm text-amber-900">{result.message}</p>
                                        {result.suggestions && result.suggestions.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {result.suggestions.map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => useExample(s)}
                                                        className="px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-full text-amber-900 hover:bg-amber-100 text-left"
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

                        {!result && (
                            <div className="mt-4">
                                <p className="text-xs text-ink-muted m-0 mb-2">Try one of these:</p>
                                <div className="flex flex-col gap-1.5">
                                    {EXAMPLE_QUERIES.slice(0, 5).map((ex) => (
                                        <button
                                            key={ex}
                                            type="button"
                                            onClick={() => useExample(ex)}
                                            className="px-3 py-2 text-xs bg-surface-soft hover:bg-brand-50 hover:text-brand-700 text-ink-soft border border-surface-border rounded-lg transition-colors text-left"
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Launcher */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close question box' : 'Ask a factor question'}
                aria-expanded={open}
                className={`fixed bottom-5 right-5 z-50 no-print
                    flex items-center gap-2 rounded-full shadow-lg
                    transition-all duration-200
                    ${open
                        ? 'w-14 h-14 justify-center bg-ink hover:bg-ink-soft'
                        : 'h-14 px-5 bg-brand-600 hover:bg-brand-700 hover:shadow-xl'}`}
            >
                {open ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2.5" strokeLinecap="round"
                        aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="text-white font-semibold text-sm hidden sm:inline">
                            Ask a question
                        </span>
                    </>
                )}
            </button>
        </>
    );
}

function CompactAnswer({ result, showSteps, onToggleSteps, onClose }) {
    return (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider m-0">
                Answer
            </p>
            <p className="mt-1 mb-0 text-sm font-bold text-ink leading-snug">
                {result.headline}
            </p>

            {result.detail && (
                <p className="mt-2 mb-0 text-xs text-ink-soft leading-relaxed">
                    {result.detail}
                </p>
            )}

            {result.steps.length > 0 && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={onToggleSteps}
                        className="text-xs text-brand-600 hover:text-brand-700 underline"
                    >
                        {showSteps ? 'Hide working' : 'Show working'}
                    </button>

                    {showSteps && (
                        <div className="mt-2 bg-white border border-brand-100 rounded p-2.5 font-mono text-xs text-ink overflow-x-auto max-h-40 overflow-y-auto">
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
                <div className="mt-3 pt-2 border-t border-brand-100 flex flex-wrap gap-1.5">
                    {result.links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={onClose}
                            className="text-xs px-2.5 py-1 bg-white border border-brand-200 rounded-lg no-underline text-brand-700 hover:bg-brand-50"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}