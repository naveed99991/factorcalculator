import { buildFAQPage, serializeSchema } from '../lib/schema';

/**
 * FAQ Accordion — expandable Q/A section with JSON-LD FAQPage schema.
 *
 * Uses native <details>/<summary> for zero-JS accessibility.
 * Only emits FAQPage schema when 3+ FAQs are provided (per Google guidelines).
 *
 * @param {Object} props
 * @param {Array<{question: string, answer: string}>} props.faqs
 * @param {string} [props.title='Frequently Asked Questions']
 * @param {boolean} [props.emitSchema=true] — set false to render UI without JSON-LD
 *   (useful if another component on the page already emits FAQPage schema)
 */
export default function FAQAccordion({
    faqs = [],
    title = 'Frequently Asked Questions',
    emitSchema = true,
}) {
    if (!Array.isArray(faqs) || faqs.length === 0) return null;

    const schema = emitSchema ? buildFAQPage(faqs) : null;

    return (
        <section className="my-10" aria-labelledby="faq-heading">
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
                />
            )}

            <h2 id="faq-heading" className="mb-6">
                {title}
            </h2>

            <div className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden bg-white">
                {faqs.map((faq, i) => (
                    <details
                        key={i}
                        className="group faq-item"
                    >
                        <summary
                            className="list-none cursor-pointer px-5 py-4 flex items-start justify-between gap-4
                         hover:bg-surface-soft transition-colors"
                        >
                            <h3 className="text-base sm:text-lg font-semibold text-ink m-0 flex-1">
                                {faq.question}
                            </h3>
                            <span
                                className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 text-brand-600
                           flex items-center justify-center transition-transform group-open:rotate-45"
                                aria-hidden="true"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </span>
                        </summary>
                        <div className="px-5 pb-5 -mt-1 text-ink-soft leading-relaxed">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}