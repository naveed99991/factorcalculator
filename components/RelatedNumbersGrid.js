import Link from 'next/link';

/**
 * Grid of related-number links for cross-linking programmatic pages.
 * Used on /factors-of-N/ pages, and on homepage for "popular numbers".
 *
 * @param {Object} props
 * @param {Array<number|{n: number, label?: string, tag?: string}>} props.numbers
 *   Either plain numbers, or objects with an optional label/tag override.
 *   Tag examples: 'prev', 'next', 'half', 'double', 'prime factor', 'perfect square'.
 * @param {string} [props.title='Related Numbers']
 * @param {string} [props.description]
 * @param {number} [props.columns=4] — default columns on desktop (mobile stays 2)
 * @param {string} [props.pathPrefix='/factors-of-'] — allows reuse for other page types
 */
export default function RelatedNumbersGrid({
    numbers = [],
    title = 'Related Numbers',
    description,
    columns = 4,
    pathPrefix = '/factors-of-',
}) {
    if (!Array.isArray(numbers) || numbers.length === 0) return null;

    // Normalize entries into consistent shape
    const items = numbers.map((entry) =>
        typeof entry === 'number' ? { n: entry } : entry
    );

    // Column classes — Tailwind needs full class names at build time
    const colClasses = {
        2: 'grid-cols-2 sm:grid-cols-2',
        3: 'grid-cols-2 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
        6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    };
    const gridClass = colClasses[columns] || colClasses[4];

    return (
        <section className="my-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-2">
                {title}
            </h2>
            {description && (
                <p className="text-ink-muted mt-0 mb-5">{description}</p>
            )}

            <ul className={`grid ${gridClass} gap-3 list-none pl-0`}>
                {items.map((item) => (
                    <li key={item.n} className="m-0">
                        <Link
                            href={`${pathPrefix}${item.n}/`}
                            className="block p-4 bg-white border border-surface-border rounded-lg
                         hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm
                         transition-all no-underline group text-center"
                        >
                            <div className="font-semibold text-ink group-hover:text-brand-700">
                                {item.label || `Factors of ${item.n}`}
                            </div>
                            {item.tag && (
                                <div className="text-xs text-ink-muted mt-1">
                                    {item.tag}
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}