/**
 * Natural-language question parser for factor/divisibility questions.
 *
 * Deliberately rule-based rather than LLM-backed: every answer is computed
 * by the same tested math library the calculators use, so it cannot be wrong.
 * Patterns are ordered most-specific first.
 */

import {
    getFactors,
    getFactorPairs,
    getGCF,
    getLCM,
    getCommonFactors,
    getPrimeFactorization,
    formatPrimeFactorization,
    getDivisorSum,
    isPrime,
} from './factorMath';

const MAX = 1000000000000;

/* ------------------------------------------------------------ helpers */

function allNumbers(text) {
    const found = text.match(/\d+/g);
    if (!found) return [];
    return found.map(Number).filter((n) => Number.isFinite(n) && n > 0 && n <= MAX);
}

function joinList(items) {
    const parts = items.map(String);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function numberLink(n) {
    return n >= 1 && n <= 1200
        ? { href: `/factors-of-${n}/`, label: `Factors of ${n}` }
        : null;
}

function ok(kind, headline, opts = {}) {
    return {
        ok: true,
        kind,
        headline,
        detail: opts.detail || null,
        steps: opts.steps || [],
        table: opts.table || null,
        links: (opts.links || []).filter(Boolean),
    };
}

/* ------------------------------------------------------------ handlers */

/**
 * "how many of these numbers have a factor of 7? 17, 21, 26, 27, 35, 56, 77"
 * "which of these are divisible by 3: 12, 15, 20"
 */
function filterListByDivisor(text) {
    const divisorMatch = text.match(
        /(?:factor|divisor)\s+of\s+(\d+)|divisible\s+by\s+(\d+)|multiples?\s+of\s+(\d+)/
    );
    if (!divisorMatch) return null;

    const divisor = Number(
        divisorMatch[1] || divisorMatch[2] || divisorMatch[3]
    );
    if (!divisor || divisor < 1) return null;

    // Remove the divisor phrase so it isn't counted as part of the list
    const rest = text.replace(divisorMatch[0], ' ');
    const list = allNumbers(rest);

    if (list.length < 2) return null;

    const matching = list.filter((n) => n % divisor === 0);
    const nonMatching = list.filter((n) => n % divisor !== 0);

    const asksHowMany = /how many/.test(text);
    const headline = asksHowMany
        ? `${matching.length} of the ${list.length} numbers ${matching.length === 1 ? 'has' : 'have'
        } ${divisor} as a factor.`
        : matching.length === 0
            ? `None of those numbers are divisible by ${divisor}.`
            : `${joinList(matching)} ${matching.length === 1 ? 'is' : 'are'
            } divisible by ${divisor}.`;

    const detail =
        matching.length > 0
            ? `Divisible by ${divisor}: ${matching.join(', ')}.${nonMatching.length ? ` Not divisible: ${nonMatching.join(', ')}.` : ''
            }`
            : `None of ${joinList(list)} divide evenly by ${divisor}.`;

    const steps = list.map((n) => {
        const q = n / divisor;
        return n % divisor === 0
            ? `${n} ÷ ${divisor} = ${q}  ✓`
            : `${n} ÷ ${divisor} = ${(n / divisor).toFixed(2)}  ✗`;
    });

    return ok('divisibility-filter', headline, {
        detail,
        steps,
        links: [
            numberLink(divisor),
            ...matching.slice(0, 3).map(numberLink),
        ],
    });
}

/** "is 7 a factor of 56" / "is 56 divisible by 7" */
function isFactorOf(text) {
    let m = text.match(/is\s+(\d+)\s+a\s+(?:factor|divisor)\s+of\s+(\d+)/);
    let a, b;
    if (m) {
        a = Number(m[1]);
        b = Number(m[2]);
    } else {
        m = text.match(/is\s+(\d+)\s+divisible\s+by\s+(\d+)/);
        if (!m) return null;
        b = Number(m[1]);
        a = Number(m[2]);
    }
    if (!a || !b) return null;

    const yes = b % a === 0;
    const headline = yes
        ? `Yes — ${a} is a factor of ${b}.`
        : `No — ${a} is not a factor of ${b}.`;

    const detail = yes
        ? `${b} ÷ ${a} = ${b / a}, with no remainder. That makes ${a} and ${b / a
        } a factor pair of ${b}.`
        : `${b} ÷ ${a} leaves a remainder of ${b % a}, so ${a} does not divide ${b} evenly.`;

    return ok('is-factor', headline, {
        detail,
        links: [numberLink(b), numberLink(a)],
    });
}

/** "gcf of 12 and 18" */
function gcfQuery(text) {
    if (
        !/\b(?:gcf|hcf|gcd)\b|greatest\s+common\s+(?:factor|divisor)|highest\s+common\s+factor/.test(
            text
        )
    ) {
        return null;
    }
    const nums = allNumbers(text);
    if (nums.length < 2) return null;

    const g = getGCF(nums);
    const common = getCommonFactors(nums);

    return ok('gcf', `The GCF of ${joinList(nums)} is ${g}.`, {
        detail:
            g === 1
                ? `These numbers are coprime — 1 is the only factor they share.`
                : `${g} is the largest number that divides all of them evenly. All shared factors: ${common.join(
                    ', '
                )}.`,
        steps: nums.map((n) => `${n} = ${formatPrimeFactorization(n)}`),
        links: [
            { href: '/gcf-calculator/', label: 'GCF Calculator' },
            { href: '/common-factors/', label: 'Common Factors Calculator' },
        ],
    });
}

/** "lcm of 4 and 6" */
function lcmQuery(text) {
    if (
        !/\blcm\b|least\s+common\s+(?:multiple|denominator)|lowest\s+common\s+(?:multiple|denominator)/.test(
            text
        )
    ) {
        return null;
    }
    const nums = allNumbers(text);
    if (nums.length < 2) return null;

    const l = getLCM(nums);
    if (!Number.isSafeInteger(l)) return null;

    return ok('lcm', `The LCM of ${joinList(nums)} is ${l}.`, {
        detail: `${l} is the smallest number that ${joinList(
            nums
        )} all divide into evenly.`,
        steps: nums.map((n) => `${l} ÷ ${n} = ${l / n}`),
        links: [{ href: '/lcm-calculator/', label: 'LCM Calculator' }],
    });
}

/** "common factors of 12 and 18" */
function commonFactorsQuery(text) {
    if (!/common\s+factors?/.test(text)) return null;
    const nums = allNumbers(text);
    if (nums.length < 2) return null;

    const common = getCommonFactors(nums);
    const g = getGCF(nums);

    return ok(
        'common-factors',
        `${joinList(nums)} share ${common.length} common factor${common.length === 1 ? '' : 's'
        }.`,
        {
            detail: `Common factors: ${common.join(
                ', '
            )}. The greatest common factor is ${g}.`,
            links: [
                { href: '/common-factors/', label: 'Common Factors Calculator' },
                { href: '/gcf-calculator/', label: 'GCF Calculator' },
            ],
        }
    );
}

/** "is 91 prime" */
function primeCheck(text) {
    const m = text.match(/is\s+(\d+)\s+(?:a\s+)?prime/);
    if (!m) return null;
    const n = Number(m[1]);
    if (!n) return null;

    const prime = isPrime(n);
    const factors = getFactors(n);

    if (n === 1) {
        return ok('prime-check', '1 is neither prime nor composite.', {
            detail:
                'A prime number has exactly two factors. 1 has only one factor — itself — so it is called a unit.',
            links: [numberLink(1)],
        });
    }

    return ok(
        'prime-check',
        prime ? `Yes — ${n} is a prime number.` : `No — ${n} is not prime.`,
        {
            detail: prime
                ? `${n} has exactly two factors: 1 and ${n}.`
                : `${n} is composite with ${factors.length} factors: ${factors.join(
                    ', '
                )}. Its prime factorization is ${formatPrimeFactorization(n)}.`,
            links: [numberLink(n), { href: '/prime-factorization/', label: 'Prime Factorization Calculator' }],
        }
    );
}

/** "prime factorization of 360" */
function primeFactorizationQuery(text) {
    if (!/prime\s+factor(?:i[sz]ation|s)?/.test(text)) return null;
    const nums = allNumbers(text);
    if (nums.length !== 1) return null;

    const n = nums[0];
    if (n < 2) return null;

    const pf = getPrimeFactorization(n);
    const expanded = [];
    for (const [p, e] of pf) for (let i = 0; i < e; i++) expanded.push(p);

    const steps = [];
    let cur = n;
    for (const p of expanded) {
        steps.push(`${cur} ÷ ${p} = ${cur / p}`);
        cur /= p;
    }

    return ok(
        'prime-factorization',
        `${n} = ${formatPrimeFactorization(n)}`,
        {
            detail: `Written out in full: ${expanded.join(' × ')} = ${n}.`,
            steps,
            links: [numberLink(n), { href: '/prime-factorization/', label: 'Prime Factorization Calculator' }],
        }
    );
}

/** "which is a factor pair of 72" / "what two numbers multiply to 24" */
function factorPairsQuery(text) {
    const isPairQuery =
        /factor\s+pairs?/.test(text) ||
        /(?:two\s+numbers|what)\s+multipl\w*\s+(?:to\s+(?:give\s+)?|and\s+equals?\s+)?/.test(
            text
        );
    if (!isPairQuery) return null;

    const nums = allNumbers(text);
    if (nums.length === 0) return null;

    // The target is usually the largest number mentioned
    const n = Math.max(...nums);
    const pairs = getFactorPairs(n);
    if (pairs.length === 0) return null;

    // If the question offers candidate pairs, check them
    const candidates = nums.filter((x) => x !== n);
    let detail = `${n} has ${pairs.length} factor pair${pairs.length === 1 ? '' : 's'
        }.`;

    if (candidates.length >= 2) {
        const valid = [];
        for (let i = 0; i < candidates.length - 1; i++) {
            const a = candidates[i];
            const b = candidates[i + 1];
            if (a * b === n) valid.push(`${a} × ${b}`);
        }
        if (valid.length > 0) {
            detail = `From the numbers given, ${joinList(
                valid
            )} multiplies to ${n}.`;
        }
    }

    return ok(
        'factor-pairs',
        `The factor pairs of ${n} are ${pairs
            .map(([a, b]) => `${a} × ${b}`)
            .join(', ')}.`,
        {
            detail,
            steps: pairs.map(([a, b]) => `${a} × ${b} = ${n}`),
            links: [numberLink(n)],
        }
    );
}

/** "how many factors does 36 have" */
function factorCountQuery(text) {
    if (!/how\s+many\s+(?:factors|divisors)/.test(text)) return null;
    const nums = allNumbers(text);
    if (nums.length !== 1) return null;

    const n = nums[0];
    const factors = getFactors(n);
    const pf = getPrimeFactorization(n);

    return ok(
        'factor-count',
        `${n} has ${factors.length} factor${factors.length === 1 ? '' : 's'}.`,
        {
            detail: `They are ${factors.join(', ')}.`,
            steps:
                pf.length > 0
                    ? [
                        `${n} = ${formatPrimeFactorization(n)}`,
                        `Add 1 to each exponent: ${pf
                            .map(([, e]) => `(${e} + 1)`)
                            .join(' × ')}`,
                        `= ${pf.map(([, e]) => e + 1).join(' × ')} = ${factors.length}`,
                    ]
                    : [],
            links: [numberLink(n), { href: '/divisors/', label: 'Divisor Calculator' }],
        }
    );
}

/** "what are the factors of 84" — and the bare-number fallback */
function factorsOfQuery(text) {
    const nums = allNumbers(text);
    if (nums.length !== 1) return null;

    const looksLikeFactorQuery =
        /factors?\s+(?:of|for)\s+\d+/.test(text) ||
        /\bdivisors?\s+of\s+\d+/.test(text) ||
        /^\s*\d+\s*\??\s*$/.test(text);

    if (!looksLikeFactorQuery) return null;

    const n = nums[0];
    const factors = getFactors(n);
    if (factors.length === 0) return null;

    return ok(
        'factors-of',
        `The factors of ${n} are ${factors.join(', ')}.`,
        {
            detail: `${n} has ${factors.length} factor${factors.length === 1 ? '' : 's'
                }. Prime factorization: ${formatPrimeFactorization(
                    n
                )}. Sum of factors: ${getDivisorSum(n)}.`,
            steps: getFactorPairs(n).map(([a, b]) => `${a} × ${b} = ${n}`),
            links: [numberLink(n)],
        }
    );
}

/* ------------------------------------------------------------ entry */

const HANDLERS = [
    filterListByDivisor,
    isFactorOf,
    primeCheck,
    gcfQuery,
    lcmQuery,
    commonFactorsQuery,
    primeFactorizationQuery,
    factorPairsQuery,
    factorCountQuery,
    factorsOfQuery,
];

/**
 * Parse a natural-language question.
 * @returns {Object} { ok, kind, headline, detail, steps, links } or { ok:false, message }
 */
/**
 * Parse a natural-language question.
 * @returns {Object} { ok, kind, headline, detail, steps, links } or { ok:false, message, suggestions }
 */
export function parseQuery(input) {
    if (typeof input !== 'string' || input.trim() === '') {
        return {
            ok: false,
            message: 'Type a question to get started.',
            suggestions: EXAMPLE_QUERIES.slice(0, 4),
        };
    }

    const text = input
        .toLowerCase()
        .replace(/[,;]/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();

    for (const handler of HANDLERS) {
        try {
            const result = handler(text);
            if (result) return result;
        } catch {
            // A handler failing shouldn't break the whole parser
        }
    }

    const nums = allNumbers(text);

    // No numbers at all — the question is incomplete rather than unrecognised.
    // Point at the topic they seem to be asking about.
    if (nums.length === 0) {
        return {
            ok: false,
            message: buildNoNumberMessage(text),
            suggestions: suggestForTopic(text),
        };
    }

    // Numbers present but no pattern matched — answer with the factors,
    // which is what almost every factor question ultimately needs.
    const n = nums[0];
    const factors = getFactors(n);
    if (factors.length > 0) {
        return ok('fallback-factors', `The factors of ${n} are ${factors.join(', ')}.`, {
            detail:
                'That question wasn\'t recognised exactly, so here are the factors of the first number found. Rephrasing usually helps — try one of the examples below.',
            steps: getFactorPairs(n).map(([a, b]) => `${a} × ${b} = ${n}`),
            links: [numberLink(n)],
        });
    }

    return {
        ok: false,
        message:
            'That question wasn\'t recognised. Include at least one number — for example, "factors of 84" or "is 7 a factor of 56".',
        suggestions: EXAMPLE_QUERIES.slice(0, 4),
    };
}

/** Tailor the "no number found" message to what the question was about. */
function buildNoNumberMessage(text) {
    if (/factor\s+pairs?/.test(text)) {
        return 'Which number\'s factor pairs do you need? Add a number — for example, "factor pairs of 72".';
    }
    if (/prime\s+factor/.test(text)) {
        return 'Which number should be broken into primes? Try "prime factorization of 360".';
    }
    if (/\b(?:gcf|hcf|gcd)\b|greatest\s+common/.test(text)) {
        return 'The GCF needs two or more numbers. Try "GCF of 48 and 60".';
    }
    if (/\blcm\b|least\s+common|lowest\s+common/.test(text)) {
        return 'The LCM needs two or more numbers. Try "LCM of 12 and 18".';
    }
    if (/common\s+factors?/.test(text)) {
        return 'Common factors need two or more numbers. Try "common factors of 24 and 36".';
    }
    if (/prime/.test(text)) {
        return 'Which number should be checked? Try "is 91 a prime number".';
    }
    if (/divisor/.test(text)) {
        return 'Which number\'s divisors do you need? Try "how many divisors does 120 have".';
    }
    if (/factor|multipl|divisib/.test(text)) {
        return 'Almost — that question needs a number in it. Try "factors of 84" or "is 7 a factor of 56".';
    }
    return 'Add a number to your question — for example, "factors of 84" or "GCF of 12 and 18".';
}

/** Suggest examples that match the topic the user was asking about. */
function suggestForTopic(text) {
    const pick = (pattern) => EXAMPLE_QUERIES.filter((q) => pattern.test(q.toLowerCase()));

    if (/factor\s+pairs?|multipl/.test(text)) {
        return ['Which is a factor pair of 72?', 'What are the factors of 84?'];
    }
    if (/prime\s+factor/.test(text)) {
        return ['Prime factorization of 360', 'How many factors does 36 have?'];
    }
    if (/\b(?:gcf|hcf|gcd)\b|greatest\s+common|common\s+factors?/.test(text)) {
        return ['GCF of 48 and 60', 'Common factors of 24 and 36'];
    }
    if (/\blcm\b|least\s+common|lowest\s+common|multiple/.test(text)) {
        return ['LCM of 12 and 18', 'GCF of 48 and 60'];
    }
    if (/prime/.test(text)) {
        return ['Is 91 a prime number?', 'Prime factorization of 360'];
    }
    if (/divisib|divisor/.test(text)) {
        return [
            'How many of these have a factor of 7? 17, 21, 26, 27, 35, 56, 77',
            'Is 7 a factor of 56?',
        ];
    }
    return EXAMPLE_QUERIES.slice(0, 4);
}

/** Example questions shown under the input. */
export const EXAMPLE_QUERIES = [
    'How many of these have a factor of 7? 17, 21, 26, 27, 35, 56, 77',
    'Is 7 a factor of 56?',
    'What are the factors of 84?',
    'GCF of 48 and 60',
    'LCM of 12 and 18',
    'Which is a factor pair of 72?',
    'Is 91 a prime number?',
    'Prime factorization of 360',
    'How many factors does 36 have?',
    'Common factors of 24 and 36',
];