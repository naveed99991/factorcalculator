/**
 * Generates unique, number-specific content for /factors-of-N/ pages.
 * Every sentence is computed from the number's actual properties.
 */

import {
    getFactors,
    getFactorPairs,
    getPrimeFactorization,
    getPrimeFactorsList,
    getDistinctPrimeFactors,
    formatPrimeFactorization,
    getDivisorSum,
    getAliquotSum,
    isPrime,
    isPerfect,
    isAbundant,
    isDeficient,
    isPerfectSquare,
    isPerfectCube,
    isEven,
    getRelatedNumbers,
} from './factorMath';

const FIBONACCI = new Set([
    1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
]);

const TRIANGULAR = new Set([
    1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171,
    190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528, 561,
    595, 630, 666, 703, 741, 780, 820, 861, 903, 946, 990, 1035, 1081, 1128, 1176,
]);

const HIGHLY_COMPOSITE = new Set([
    1, 2, 4, 6, 12, 24, 36, 48, 60, 120, 180, 240, 360, 720, 840,
]);

export function buildNumberFacts(n) {
    const factors = getFactors(n);
    const pairs = getFactorPairs(n);
    const factorization = getPrimeFactorization(n);
    const primesList = getPrimeFactorsList(n);
    const distinctPrimes = getDistinctPrimeFactors(n);
    const divisorSum = getDivisorSum(n);
    const aliquot = getAliquotSum(n);

    const prime = isPrime(n);
    const perfect = isPerfect(n);
    const abundant = isAbundant(n);
    const deficient = isDeficient(n);
    const square = isPerfectSquare(n);
    const cube = isPerfectCube(n);
    const even = isEven(n);

    return {
        n,
        factors,
        pairs,
        factorization,
        primesList,
        distinctPrimes,
        divisorSum,
        aliquot,
        factorCount: factors.length,
        primeFormatted: formatPrimeFactorization(n),
        largestProperFactor: factors.length > 1 ? factors[factors.length - 2] : null,
        prime,
        composite: n > 1 && !prime,
        perfect,
        abundant,
        deficient,
        square,
        cube,
        even,
        sqrt: square ? Math.round(Math.sqrt(n)) : null,
        cbrt: cube ? Math.round(Math.cbrt(n)) : null,
        fibonacci: FIBONACCI.has(n),
        triangular: TRIANGULAR.has(n),
        highlyComposite: HIGHLY_COMPOSITE.has(n),
        related: getRelatedNumbers(n, { max: 1200 }),
    };
}

export function buildAnswerParagraph(f) {
    const { n, factors, factorCount, primeFormatted, divisorSum } = f;

    if (n === 1) {
        return `The number 1 has exactly one factor: 1 itself. It is the only positive integer with a single factor, which makes it neither prime nor composite — mathematicians call it a unit. Because 1 divides every whole number, it appears in the factor list of every number.`;
    }

    if (f.prime) {
        return `The factors of ${n} are 1 and ${n}. Since ${n} is a prime number, it has exactly 2 factors and cannot be divided evenly by any other whole number. The sum of its factors is ${divisorSum}, and its prime factorization is simply ${n} itself.`;
    }

    const factorList = formatFactorList(factors);
    let text = `The factors of ${n} are ${factorList}. In total, ${n} has ${factorCount} factors. Its prime factorization is ${primeFormatted}, and the sum of all its factors is ${divisorSum}.`;

    if (f.square) {
        text += ` ${n} is also a perfect square, equal to ${f.sqrt} × ${f.sqrt}.`;
    } else if (f.perfect) {
        text += ` ${n} is a perfect number — its proper factors add up to exactly ${n}.`;
    }

    return text;
}

export function buildNotes(f) {
    const { n } = f;
    const notes = [];

    if (n === 1) {
        notes.push(
            'The number 1 is a unit — neither prime nor composite. It is the only number with exactly one factor.'
        );
        notes.push(
            'Because 1 divides every whole number, it is a factor of every number in existence.'
        );
        return notes;
    }

    if (f.prime) {
        notes.push(
            `${n} is a prime number, so its only factors are 1 and ${n}. It cannot be split into a product of two smaller whole numbers.`
        );
        notes.push(
            `Every prime number is deficient — the sum of its proper factors is always 1, which is far less than the number itself.`
        );
    } else {
        notes.push(
            `${n} is a composite number, meaning it has more than two factors. It can be written as a product of smaller whole numbers in ${f.pairs.length} different ways.`
        );
    }

    if (f.square) {
        notes.push(
            `${n} is a perfect square: ${f.sqrt} × ${f.sqrt} = ${n}. This is why it has an odd number of factors (${f.factorCount}) — the pair (${f.sqrt}, ${f.sqrt}) counts only once.`
        );
    }

    if (f.cube) {
        notes.push(
            `${n} is a perfect cube: ${f.cbrt} × ${f.cbrt} × ${f.cbrt} = ${n}.`
        );
    }

    if (f.perfect) {
        notes.push(
            `${n} is a perfect number — a rare classification. Its proper factors (${f.factors
                .slice(0, -1)
                .join(', ')}) add up to exactly ${n}. Only 51 perfect numbers are known.`
        );
    } else if (f.abundant) {
        notes.push(
            `${n} is an abundant number: its proper factors sum to ${f.aliquot}, which is ${f.aliquot - n
            } more than ${n} itself.`
        );
    } else if (f.deficient && !f.prime) {
        notes.push(
            `${n} is a deficient number: its proper factors sum to ${f.aliquot}, which is ${n - f.aliquot
            } less than ${n} itself.`
        );
    }

    if (f.highlyComposite) {
        notes.push(
            `${n} is a highly composite number — it has more factors (${f.factorCount}) than any smaller positive integer. Numbers like this are useful in measurement systems because they divide evenly so many ways.`
        );
    }

    if (f.fibonacci) {
        notes.push(
            `${n} appears in the Fibonacci sequence, where each number is the sum of the two before it.`
        );
    }

    if (f.triangular) {
        const k = Math.round((Math.sqrt(8 * n + 1) - 1) / 2);
        notes.push(
            `${n} is a triangular number — it is the sum of the first ${k} whole numbers (1 + 2 + … + ${k} = ${n}).`
        );
    }

    if (f.distinctPrimes.length === 1 && !f.prime) {
        notes.push(
            `${n} is a prime power: it is ${f.distinctPrimes[0]} raised to the power of ${f.factorization[0][1]
            }. All of its factors are powers of ${f.distinctPrimes[0]}.`
        );
    }

    if (f.distinctPrimes.length >= 3) {
        notes.push(
            `${n} has ${f.distinctPrimes.length} distinct prime factors (${f.distinctPrimes.join(
                ', '
            )}), which is why it has so many divisors.`
        );
    }

    return notes;
}

export function buildNumberFaqs(f) {
    const { n, factors, factorCount, primeFormatted, divisorSum, pairs } = f;
    const faqs = [];

    faqs.push({
        question: `What are the factors of ${n}?`,
        answer:
            n === 1
                ? `The only factor of 1 is 1 itself. No other whole number divides 1 exactly.`
                : `The factors of ${n} are ${formatFactorList(
                    factors
                )}. That is ${factorCount} factors in total, counting both 1 and ${n}.`,
    });

    faqs.push({
        question: `Is ${n} a prime number?`,
        answer:
            n === 1
                ? `No. The number 1 is neither prime nor composite — it is called a unit, because it has only one factor.`
                : f.prime
                    ? `Yes, ${n} is a prime number. It has exactly two factors: 1 and ${n}. No other whole number divides it evenly.`
                    : `No, ${n} is not prime — it is a composite number with ${factorCount} factors. A prime number has exactly two factors, but ${n} is also divisible by ${f.factors[1]}.`,
    });

    if (n > 1) {
        faqs.push({
            question: `What is the prime factorization of ${n}?`,
            answer: f.prime
                ? `${n} is already prime, so its prime factorization is simply ${n}. It cannot be broken down any further.`
                : `The prime factorization of ${n} is ${primeFormatted}. Written out in full: ${f.primesList.join(
                    ' × '
                )} = ${n}. Its distinct prime factors are ${f.distinctPrimes.join(', ')}.`,
        });
    }

    if (pairs.length > 0 && n > 1) {
        faqs.push({
            question: `What two numbers multiply to give ${n}?`,
            answer: `There ${pairs.length === 1 ? 'is' : 'are'} ${pairs.length} pair${pairs.length === 1 ? '' : 's'
                } of whole numbers that multiply to ${n}: ${pairs
                    .map(([a, b]) => `${a} × ${b}`)
                    .join(', ')}.`,
        });
    }

    faqs.push({
        question: `What is the sum of the factors of ${n}?`,
        answer: `Adding all the factors of ${n} together gives ${divisorSum}. Excluding ${n} itself, the proper factors sum to ${f.aliquot}.`,
    });

    if (n > 1) {
        faqs.push({
            question: `Is ${n} a perfect square?`,
            answer: f.square
                ? `Yes, ${n} is a perfect square. It equals ${f.sqrt} × ${f.sqrt}. Perfect squares always have an odd number of factors — ${n} has ${factorCount}.`
                : `No, ${n} is not a perfect square. There is no whole number that multiplies by itself to give ${n}. The nearest perfect squares are ${Math.floor(Math.sqrt(n)) ** 2
                } and ${(Math.floor(Math.sqrt(n)) + 1) ** 2}.`,
        });
    }

    if (f.largestProperFactor) {
        faqs.push({
            question: `What is the largest factor of ${n} other than itself?`,
            answer: `The largest factor of ${n} apart from ${n} itself is ${f.largestProperFactor}, since ${n} ÷ ${f.largestProperFactor} = ${n / f.largestProperFactor
                }.`,
        });
    }

    faqs.push({
        question: `How many factors does ${n} have?`,
        answer:
            n === 1
                ? `1 has exactly one factor.`
                : `${n} has ${factorCount} factors: ${formatFactorList(factors)}.${f.factorization.length > 0 && !f.prime
                    ? ` You can verify this from the prime factorization ${primeFormatted}: add 1 to each exponent and multiply, giving ${f.factorization
                        .map(([, e]) => e + 1)
                        .join(' × ')} = ${factorCount}.`
                    : ''
                }`,
    });

    return faqs;
}

/** "1, 2, 3, and 4" — natural English list. */
function formatFactorList(factors) {
    if (factors.length === 1) return String(factors[0]);
    if (factors.length === 2) return `${factors[0]} and ${factors[1]}`;
    return `${factors.slice(0, -1).join(', ')}, and ${factors[factors.length - 1]}`;
}

/**
 * Title under 60 chars INCLUDING the "| Factor Calculator" suffix
 * the layout template appends, so the base stays under 40 characters.
 */
export function buildTitle(f) {
    const { n, factorCount } = f;
    if (n === 1) return 'Factors of 1';
    if (f.prime) return `Factors of ${n} — Prime Number`;
    return `Factors of ${n} — ${factorCount} Factors`;
}

/** Meta description under 155 chars. */
export function buildDescription(f) {
    const { n, factors, factorCount, primeFormatted } = f;

    if (n === 1) {
        return 'The number 1 has exactly one factor: 1. Learn why 1 is neither prime nor composite, with its properties explained step by step.';
    }

    if (f.prime) {
        return `${n} is prime — its only factors are 1 and ${n}. See why, plus factor pairs, properties, and step-by-step working.`;
    }

    const head = `The ${factorCount} factors of ${n} are `;
    const tail = ` Prime factorization: ${primeFormatted}. See factor pairs and factor tree.`;
    const budget = 154 - head.length - tail.length;

    const listed = [];
    let used = 0;
    for (const factor of factors) {
        const piece = String(factor);
        const cost = used === 0 ? piece.length : piece.length + 2;
        if (used + cost > budget - 2) break;
        listed.push(piece);
        used += cost;
    }

    const ellipsis = listed.length < factors.length ? '…' : '';
    return `${head}${listed.join(', ')}${ellipsis}.${tail}`.slice(0, 154);
}