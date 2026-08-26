'use client';

import { useState } from 'react';
import { buildFactorTree, isPrime, getPrimeFactorsList } from '../lib/factorMath';

/**
 * Factor tree with two view modes: Visual (SVG) and Text (ASCII ladder).
 */
export default function FactorTree({ n, maxWidth = 560 }) {
    const [view, setView] = useState('visual');

    if (!Number.isInteger(n) || n < 2) return null;

    return (
        <figure className="my-6" aria-label={`Factor tree of ${n}`}>
            <div className="flex justify-center gap-1 mb-3 no-print">
                <button
                    type="button"
                    onClick={() => setView('visual')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'visual'
                            ? 'bg-brand-600 text-white'
                            : 'bg-surface-alt text-ink-soft hover:bg-surface-border'
                        }`}
                    aria-pressed={view === 'visual'}
                >
                    Visual
                </button>
                <button
                    type="button"
                    onClick={() => setView('text')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'text'
                            ? 'bg-brand-600 text-white'
                            : 'bg-surface-alt text-ink-soft hover:bg-surface-border'
                        }`}
                    aria-pressed={view === 'text'}
                >
                    Text
                </button>
            </div>

            {view === 'visual' ? (
                <VisualTree n={n} maxWidth={maxWidth} />
            ) : (
                <TextTree n={n} />
            )}

            <figcaption className="text-center text-sm text-ink-muted mt-3">
                {view === 'visual'
                    ? 'Prime factors are shown in solid indigo. Composite numbers split into their smallest prime and the quotient.'
                    : 'Ladder-style factor tree. Each row shows the current number divided by its smallest prime factor.'}
            </figcaption>
        </figure>
    );
}

/* ============================================================
 * Visual SVG tree
 * ============================================================ */
function VisualTree({ n, maxWidth }) {
    const tree = buildFactorTree(n);
    const laidOut = layout(tree);

    const nodes = collectNodes(laidOut);
    const minX = Math.min(...nodes.map((node) => node.x));
    const maxX = Math.max(...nodes.map((node) => node.x));
    const maxY = Math.max(...nodes.map((node) => node.y));

    const NODE_RADIUS = 22;
    const H_SPACING = 70;
    const V_SPACING = 70;
    const PADDING = NODE_RADIUS + 8;

    const width = (maxX - minX) * H_SPACING + PADDING * 2;
    const height = maxY * V_SPACING + PADDING * 2;

    const px = (x) => (x - minX) * H_SPACING + PADDING;
    const py = (y) => y * V_SPACING + PADDING;

    const edges = collectEdges(laidOut);

    const titleText = `Factor tree of ${n}`;
    const titleId = `factor-tree-title-${n}`;

    return (
        <div className="overflow-x-auto">
            <svg
                role="img"
                aria-labelledby={titleId}
                viewBox={`0 0 ${width} ${height}`}
                style={{ maxWidth: `${maxWidth}px`, width: '100%', height: 'auto' }}
                className="block mx-auto"
            >
                <title id={titleId}>{titleText}</title>

                <g stroke="#C7D2FE" strokeWidth="2" fill="none">
                    {edges.map((edge, i) => (
                        <line
                            key={i}
                            x1={px(edge.from.x)}
                            y1={py(edge.from.y) + NODE_RADIUS - 2}
                            x2={px(edge.to.x)}
                            y2={py(edge.to.y) - NODE_RADIUS + 2}
                        />
                    ))}
                </g>

                <g>
                    {nodes.map((node, i) => {
                        const isLeaf = isPrime(node.value);
                        return (
                            <g key={i} transform={`translate(${px(node.x)}, ${py(node.y)})`}>
                                <circle
                                    r={NODE_RADIUS}
                                    fill={isLeaf ? '#4F46E5' : '#EEF2FF'}
                                    stroke={isLeaf ? '#4338CA' : '#A5B4FC'}
                                    strokeWidth="2"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={node.value >= 1000 ? '12' : '14'}
                                    fontWeight="600"
                                    fill={isLeaf ? '#FFFFFF' : '#312E81'}
                                    fontFamily="var(--font-inter), system-ui, sans-serif"
                                >
                                    {String(node.value)}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

/* ============================================================
 * Text ladder tree (calculator.net style)
 * ============================================================ */
function TextTree({ n }) {
    const lines = buildLadder(n);
    const copyable = lines.join('\n');

    return (
        <div className="max-w-md mx-auto">
            <pre
                className="bg-surface-soft border border-surface-border rounded-lg p-4 font-mono text-sm text-ink leading-6 overflow-x-auto whitespace-pre"
                aria-label={`Text factor tree of ${n}`}
            >
                {copyable}
            </pre>
            <div className="text-center mt-2 no-print">
                <button
                    type="button"
                    onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(copyable).catch(() => { });
                        }
                    }}
                    className="text-xs text-brand-600 hover:text-brand-700 underline"
                >
                    Copy text tree
                </button>
            </div>
        </div>
    );
}

/**
 * Build ladder-style text lines by repeatedly splitting
 * the current number into quotient and smallest prime factor.
 */
function buildLadder(n) {
    const primes = getPrimeFactorsList(n);
    if (primes.length === 0) return [String(n)];

    const lines = [];
    let current = n;

    lines.push(padCell(current));

    for (let i = 0; i < primes.length - 1; i++) {
        const prime = primes[i];
        const next = current / prime;
        lines.push('| \\');
        lines.push(`${padCell(next)}${prime}`);
        current = next;
    }

    return lines;
}

/** Pad a number to a 4-character cell so ASCII columns line up. */
function padCell(num) {
    const s = String(num);
    return s + ' '.repeat(Math.max(0, 4 - s.length));
}

/* ============================================================
 * Layout helpers
 * ============================================================ */
function layout(node, depth = 0, xCounter = { i: 0 }) {
    const out = { ...node, y: depth };

    if (!node.left && !node.right) {
        out.x = xCounter.i;
        xCounter.i += 1;
        return out;
    }

    out.left = layout(node.left, depth + 1, xCounter);
    out.right = layout(node.right, depth + 1, xCounter);
    out.x = (out.left.x + out.right.x) / 2;
    return out;
}

function collectNodes(node, acc = []) {
    acc.push({ value: node.value, x: node.x, y: node.y });
    if (node.left) collectNodes(node.left, acc);
    if (node.right) collectNodes(node.right, acc);
    return acc;
}

function collectEdges(node, acc = []) {
    if (node.left) {
        acc.push({
            from: { x: node.x, y: node.y },
            to: { x: node.left.x, y: node.left.y },
        });
        collectEdges(node.left, acc);
    }
    if (node.right) {
        acc.push({
            from: { x: node.x, y: node.y },
            to: { x: node.right.x, y: node.right.y },
        });
        collectEdges(node.right, acc);
    }
    return acc;
}