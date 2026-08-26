/**
 * Core math utilities for the Factor Calculator suite.
 *
 * All functions are pure. All accept a "raw" input first, then a
 * normalized number. Callers should use `normalizeInput()` in UI code
 * to convert user input (string/negative/large/etc.) into a validated
 * result before calling the math functions.
 *
 * Correctness matters more than micro-optimization here: 1200 pages
 * share this code. Every function has unit tests.
 */

/* =========================================================
 * INPUT NORMALIZATION & VALIDATION
 * ========================================================= */

const MAX_SAFE = 1_000_000_000_000; // 10^12 — hard cap for UI

/**
 * Normalize user input from the calculator field.
 * Returns a discriminated result — never throws.
 *
 * @param {string|number} raw
 * @returns {{ ok: boolean, value?: number, kind?: string, message?: string, note?: string }}
 *   ok=true  → { ok, value, kind, note? }
 *   ok=false → { ok, kind, message }
 *
 *   kind values:
 *     'ok'              — valid positive integer
 *     'zero'            — user entered 0
 *     'one'             — user entered 1
 *     'negative'        — negative integer (auto absolute-value with note)
 *     'empty'           — empty/whitespace
 *     'not-integer'     — decimal
 *     'not-numeric'     — contains letters/symbols
 *     'too-large'       — above MAX_SAFE
 */
export function normalizeInput(raw) {
  if (raw === null || raw === undefined) {
    return { ok: false, kind: 'empty', message: 'Please enter a number to see its factors.' };
  }

  const str = String(raw).trim();

  if (str === '') {
    return { ok: false, kind: 'empty', message: 'Please enter a number to see its factors.' };
  }

  // Reject anything that isn't optional minus + digits (no decimals, no letters)
  if (!/^-?\d+$/.test(str)) {
    // Distinguish decimal vs non-numeric for better UX message
    if (/^-?\d+\.\d+$/.test(str)) {
      return {
        ok: false,
        kind: 'not-integer',
        message:
          'Factors are defined for integers only. Please enter a whole number (e.g. 12 instead of 12.5).',
      };
    }
    return {
      ok: false,
      kind: 'not-numeric',
      message: 'Please enter a valid positive integer (digits only).',
    };
  }

  const num = Number(str);

  if (!Number.isFinite(num)) {
    return {
      ok: false,
      kind: 'too-large',
      message: `Number too large. Please enter a value up to ${MAX_SAFE.toLocaleString()}.`,
    };
  }

  if (num === 0) {
    return {
      ok: false,
      kind: 'zero',
      message:
        '0 has infinitely many factors — every non-zero integer divides 0. Try a positive integer instead.',
    };
  }

  const abs = Math.abs(num);

  if (abs > MAX_SAFE) {
    return {
      ok: false,
      kind: 'too-large',
      message: `Number too large. Please enter a value up to ${MAX_SAFE.toLocaleString()}.`,
    };
  }

  if (num < 0) {
    return {
      ok: true,
      value: abs,
      kind: 'negative',
      note: `Factors are calculated using the absolute value. Showing factors of ${abs} (absolute value of ${num}).`,
    };
  }

  if (num === 1) {
    return { ok: true, value: 1, kind: 'one' };
  }

  return { ok: true, value: num, kind: 'ok' };
}

/* =========================================================
 * FACTORS
 * ========================================================= */

/**
 * All positive factors of n, ascending.
 * O(sqrt(n)) — collects pairs from both ends.
 *
 * @param {number} n — positive integer
 * @returns {number[]} sorted ascending
 */
export function getFactors(n) {
  if (!Number.isInteger(n) || n <= 0) return [];
  if (n === 1) return [1];

  const low = [];
  const high = [];
  const sqrt = Math.floor(Math.sqrt(n));

  for (let i = 1; i <= sqrt; i++) {
    if (n % i === 0) {
      low.push(i);
      const pair = n / i;
      if (pair !== i) high.push(pair);
    }
  }
  return low.concat(high.reverse());
}

/**
 * Factor pairs of n as [a, b] where a * b = n and a ≤ b.
 * @param {number} n
 * @returns {Array<[number, number]>}
 */
export function getFactorPairs(n) {
  if (!Number.isInteger(n) || n <= 0) return [];
  const pairs = [];
  const sqrt = Math.floor(Math.sqrt(n));
  for (let i = 1; i <= sqrt; i++) {
    if (n % i === 0) pairs.push([i, n / i]);
  }
  return pairs;
}

/**
 * Number of positive divisors of n. OEIS A000005.
 */
export function getDivisorCount(n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  return getFactors(n).length;
}

/**
 * Sum of all positive divisors of n (including n itself). OEIS A000203.
 * Uses prime factorization for efficiency on larger n.
 */
export function getDivisorSum(n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  if (n === 1) return 1;

  const factors = getPrimeFactorization(n);
  let sum = 1;
  for (const [p, e] of factors) {
    // sigma of p^e = (p^(e+1) - 1) / (p - 1)
    sum *= (Math.pow(p, e + 1) - 1) / (p - 1);
  }
  return sum;
}

/**
 * Sum of proper divisors (divisors excluding n itself). Aliquot sum. OEIS A001065.
 */
export function getAliquotSum(n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  if (n === 1) return 0;
  return getDivisorSum(n) - n;
}

/* =========================================================
 * PRIME FACTORIZATION
 * ========================================================= */

/**
 * Prime factorization as an array of [prime, exponent] pairs, ascending by prime.
 * Example: 72 → [[2, 3], [3, 2]]
 * Example: 1 → []  (1 has no prime factors by definition)
 * Example: 7 → [[7, 1]]
 *
 * Trial division up to sqrt(n). Fast enough for n ≤ 10^12.
 */
export function getPrimeFactorization(n) {
  if (!Number.isInteger(n) || n <= 1) return [];

  const factors = [];
  let remaining = n;

  // Handle 2 separately so we can step by 2 afterwards
  if (remaining % 2 === 0) {
    let count = 0;
    while (remaining % 2 === 0) {
      remaining /= 2;
      count++;
    }
    factors.push([2, count]);
  }

  // Odd divisors
  for (let i = 3; i * i <= remaining; i += 2) {
    if (remaining % i === 0) {
      let count = 0;
      while (remaining % i === 0) {
        remaining /= i;
        count++;
      }
      factors.push([i, count]);
    }
  }

  // Leftover prime > sqrt(n)
  if (remaining > 1) {
    factors.push([remaining, 1]);
  }

  return factors;
}

/**
 * Ordered list of prime factors WITH multiplicity.
 * 72 → [2, 2, 2, 3, 3]
 */
export function getPrimeFactorsList(n) {
  const result = [];
  for (const [p, e] of getPrimeFactorization(n)) {
    for (let i = 0; i < e; i++) result.push(p);
  }
  return result;
}

/**
 * Distinct prime factors only. OEIS A027748 style.
 * 72 → [2, 3]
 */
export function getDistinctPrimeFactors(n) {
  return getPrimeFactorization(n).map(([p]) => p);
}

/**
 * Human-readable exponent-form string.
 * 72 → "2³ × 3²"
 * 12 → "2² × 3"
 * 7  → "7"
 * 1  → "1"
 */
export function formatPrimeFactorization(n) {
  if (n === 1) return '1';
  const factors = getPrimeFactorization(n);
  if (factors.length === 0) return String(n);

  const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const supStr = (num) => String(num).split('').map((d) => supers[+d]).join('');

  return factors
    .map(([p, e]) => (e === 1 ? String(p) : `${p}${supStr(e)}`))
    .join(' × ');
}

/* =========================================================
 * GCF / LCM
 * ========================================================= */

/**
 * Greatest Common Factor (Euclidean algorithm).
 * Accepts 2+ numbers.
 * gcf(0, n) = n. gcf() on empty/invalid = 0.
 */
export function getGCF(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const nums = numbers
    .map((x) => (Number.isFinite(x) ? Math.abs(Math.trunc(x)) : NaN))
    .filter((x) => Number.isFinite(x));
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  return nums.reduce((acc, x) => gcd(acc, x));
}

/**
 * Least Common Multiple. lcm(a, b) = |a*b| / gcd(a, b).
 * Accepts 2+ numbers. If any is 0, result is 0.
 */
export function getLCM(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const nums = numbers
    .map((x) => (Number.isFinite(x) ? Math.abs(Math.trunc(x)) : NaN))
    .filter((x) => Number.isFinite(x));
  if (nums.length === 0) return 0;
  if (nums.some((x) => x === 0)) return 0;

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm2 = (a, b) => (a / gcd(a, b)) * b;
  return nums.reduce((acc, x) => lcm2(acc, x));
}

/**
 * All positive common factors of two or more numbers, ascending.
 * Distinct from GCF: returns the full list, not just the greatest.
 */
export function getCommonFactors(numbers) {
  const gcf = getGCF(numbers);
  return getFactors(gcf);
}

/* =========================================================
 * NUMBER PROPERTIES
 * ========================================================= */

export function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;                 // 2, 3
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function isComposite(n) {
  return Number.isInteger(n) && n > 1 && !isPrime(n);
}

/** n = aliquot sum(n). 6, 28, 496, 8128... */
export function isPerfect(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  return getAliquotSum(n) === n;
}

/** aliquot sum > n */
export function isAbundant(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  return getAliquotSum(n) > n;
}

/** aliquot sum < n. All primes are deficient. */
export function isDeficient(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  return getAliquotSum(n) < n;
}

export function isPerfectSquare(n) {
  if (!Number.isInteger(n) || n < 0) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

export function isPerfectCube(n) {
  if (!Number.isInteger(n)) return false;
  const r = Math.round(Math.cbrt(n));
  return r * r * r === n;
}

export function isEven(n) {
  return Number.isInteger(n) && n % 2 === 0;
}

export function isOdd(n) {
  return Number.isInteger(n) && Math.abs(n) % 2 === 1;
}

/* =========================================================
 * FACTOR TREE (for SVG rendering)
 * ========================================================= */

/**
 * Build a binary factor tree — each composite node splits into
 * its smallest prime factor and the quotient.
 * Leaves are primes.
 *
 * Shape: { value, left?, right? }
 *
 * 12 →
 *   { value: 12,
 *     left:  { value: 2 },
 *     right: { value: 6,
 *              left:  { value: 2 },
 *              right: { value: 3 } } }
 */
export function buildFactorTree(n) {
  if (!Number.isInteger(n) || n < 2) return { value: n };
  if (isPrime(n)) return { value: n };

  // Find smallest prime factor
  let smallest = 2;
  if (n % 2 !== 0) {
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) {
        smallest = i;
        break;
      }
    }
    // Safety: if we didn't set it (shouldn't happen since !isPrime), n itself
    if (smallest === 2 && n % 2 !== 0) smallest = n;
  }

  const other = n / smallest;
  return {
    value: n,
    left: { value: smallest },
    right: buildFactorTree(other),
  };
}

/* =========================================================
 * STEP-BY-STEP WORKINGS (for display)
 * ========================================================= */

/**
 * Prime factorization steps for display, e.g.:
 * [
 *   { dividend: 72, divisor: 2, quotient: 36 },
 *   { dividend: 36, divisor: 2, quotient: 18 },
 *   ...
 * ]
 */
export function getPrimeFactorizationSteps(n) {
  const steps = [];
  if (!Number.isInteger(n) || n < 2) return steps;

  let current = n;
  const primes = getPrimeFactorsList(n);
  for (const p of primes) {
    const next = current / p;
    steps.push({ dividend: current, divisor: p, quotient: next });
    current = next;
  }
  return steps;
}

/**
 * Trial-division steps for finding all factors.
 * Shows which numbers divide evenly and which don't (limited output).
 */
export function getDivisionMethodSteps(n) {
  if (!Number.isInteger(n) || n < 1) return [];
  const steps = [];
  const sqrt = Math.floor(Math.sqrt(n));
  for (let i = 1; i <= sqrt; i++) {
    if (n % i === 0) {
      steps.push({ divisor: i, quotient: n / i, divides: true });
    }
  }
  return steps;
}

/* =========================================================
 * NUMBER RELATIONSHIPS (for "Related Numbers" section)
 * ========================================================= */

/**
 * Generate related numbers for cross-linking on a /factors-of-N/ page.
 * Returns unique, sorted list of related integers in [2, MAX_LINKED].
 */
export function getRelatedNumbers(n, { max = 1200 } = {}) {
  if (!Number.isInteger(n) || n < 2) return [];
  const set = new Set();

  // Previous / next
  if (n - 1 >= 2) set.add(n - 1);
  if (n + 1 <= max) set.add(n + 1);

  // Half / double
  if (n % 2 === 0 && n / 2 >= 2) set.add(n / 2);
  if (n * 2 <= max) set.add(n * 2);

  // Prime factors of n
  for (const p of getDistinctPrimeFactors(n)) {
    if (p >= 2 && p <= max && p !== n) set.add(p);
  }

  // Nearest perfect square below and above
  const sqrt = Math.floor(Math.sqrt(n));
  const belowSq = sqrt * sqrt;
  const aboveSq = (sqrt + 1) * (sqrt + 1);
  if (belowSq >= 2 && belowSq !== n) set.add(belowSq);
  if (aboveSq <= max && aboveSq !== n) set.add(aboveSq);

  return Array.from(set).sort((a, b) => a - b);
}
