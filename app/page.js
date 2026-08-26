import FactorCalculator from '../components/FactorCalculator';
import MathBackdrop from '../components/MathBackdrop';
import ContentSections from '../components/ContentSections';
import FAQAccordion from '../components/FAQAccordion';
import AdSlot from '../components/AdSlot';
import { HOMEPAGE_FAQS } from '../components/homepageFaqs';
import { siteConfig, absoluteUrl, nowIso } from '../lib/siteConfig';
import {
  buildWebPage,
  buildSoftwareApplication,
  buildHowTo,
  buildSchemaGraph,
  serializeSchema,
} from '../lib/schema';

export const metadata = {
  title: 'Factor Calculator — Find All Factors of Any Number Instantly',
  description:
    'Free Factor Calculator. Find all factors, prime factorization, factor pairs, and factor tree of any number with step-by-step working.',
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    title: 'Factor Calculator — Find All Factors of Any Number',
    description:
      'Free Factor Calculator with prime factorization, factor pairs, factor tree, and step-by-step working.',
    url: absoluteUrl('/'),
    type: 'website',
  },
};

function buildPageSchema() {
  const url = absoluteUrl('/');

  const webPage = buildWebPage({
    url,
    name: 'Factor Calculator — Find All Factors of Any Number',
    description: metadata.description,
    dateModified: nowIso(),
  });

  const software = buildSoftwareApplication({
    name: 'Factor Calculator',
    url,
    description:
      'Free online calculator that finds all factors, prime factorization, factor pairs, and factor tree of any positive integer up to one trillion.',
    applicationCategory: 'EducationalApplication',
  });

  const howTo = buildHowTo({
    name: 'How to find the factors of a number',
    description:
      'Find every factor of a positive integer using trial division up to the square root.',
    totalTime: 'PT2M',
    steps: [
      {
        name: 'Enter the number',
        text: 'Type any positive whole number up to one trillion into the calculator.',
        id: 'step-enter',
      },
      {
        name: 'Read the instant answer',
        text: 'The calculator lists every factor from 1 to the number itself, and tells you how many factors there are.',
        id: 'step-answer',
      },
      {
        name: 'Review the factor pairs',
        text: 'See every pair of numbers that multiply to give your number, e.g. (1, 72), (2, 36), (3, 24), (4, 18), (6, 12), (8, 9) for 72.',
        id: 'step-pairs',
      },
      {
        name: 'Explore the prime factorization',
        text: 'The calculator shows the prime factorization step-by-step and draws a factor tree, e.g. 72 = 2³ × 3².',
        id: 'step-prime',
      },
    ],
  });

  return buildSchemaGraph(webPage, software, howTo);
}

export default function HomePage() {
  const schema = buildPageSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
      />

      <main>
        {/* Hero — full width background with narrow calculator inside */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-indigo-50">
          <MathBackdrop />
          <div className="relative z-10 container-prose py-6 sm:py-10">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-4xl m-0 tracking-tight">
                Factor Calculator
              </h1>
              <p className="mt-2 mb-0 text-sm sm:text-base text-ink-muted max-w-xl mx-auto">
                Find all factors, prime factorization, factor pairs, and factor
                tree of any number — instantly.
              </p>
            </div>

            <div className="calc-card relative bg-white rounded-2xl shadow-lg">
              <FactorCalculator initialValue={72} />
            </div>
          </div>
        </section>

        {/* Answer-first paragraph — narrow */}
        <div className="container-prose pt-8">
          <p className="text-base text-ink-soft leading-relaxed">
            The <strong>Factor Calculator</strong> above finds every factor of
            any whole number up to one trillion, along with its prime
            factorization, factor pairs, and a visual factor tree — all
            instantly. A <strong>factor</strong> is any whole number that
            divides another number exactly, with no remainder. For example, the
            factors of 12 are 1, 2, 3, 4, 6, and 12. Type any number above to
            see its factors, or read on to learn how to find factors yourself
            step-by-step.
          </p>
        </div>

        {/* Ad slot — narrow container */}
        <div className="container-prose">
          <AdSlot slotId="home-in-content-1" placement="in-content" />
        </div>

        {/* Content sections — each section decides its own width internally */}
        <ContentSections />

        {/* FAQs — narrow (reading content) */}
        <div className="container-prose">
          <FAQAccordion faqs={HOMEPAGE_FAQS} />
        </div>
      </main>
    </>
  );
}