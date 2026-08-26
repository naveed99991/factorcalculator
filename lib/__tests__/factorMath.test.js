import {
  normalizeInput,
  getFactors,
  getFactorPairs,
  getDivisorCount,
  getDivisorSum,
  getAliquotSum,
  getPrimeFactorization,
  getPrimeFactorsList,
  getDistinctPrimeFactors,
  formatPrimeFactorization,
  getGCF,
  getLCM,
  getCommonFactors,
  isPrime,
  isComposite,
  isPerfect,
  isAbundant,
  isDeficient,
  isPerfectSquare,
  isPerfectCube,
  isEven,
  isOdd,
  buildFactorTree,
  getPrimeFactorizationSteps,
  getRelatedNumbers,
} from '../factorMath';

/* =========================================================
 * normalizeInput
 * ========================================================= */
describe('normalizeInput', () => {
  test('valid positive integer', () => {
    expect(normalizeInput('72')).toEqual({ ok: true, value: 72, kind: 'ok' });
    expect(normalizeInput(100)).toEqual({ ok: true, value: 100, kind: 'ok' });
  });

  test('empty / whitespace → empty', () => {
    expect(normalizeInput('').ok).toBe(false);
    expect(normalizeInput('   ').ok).toBe(false);
    expect(normalizeInput(null).ok).toBe(false);
    expect(normalizeInput(undefined).ok).toBe(false);
  });

  test('letters/symbols → not-numeric (no silent mutation)', () => {
    const r = normalizeInput('12abc');
    expect(r.ok).toBe(false);
    expect(r.kind).toBe('not-numeric');
    expect(r.message).toMatch(/valid positive integer/i);
  });

  test('decimal → not-integer', () => {
    const r = normalizeInput('12.5');
    expect(r.ok).toBe(false);
    expect(r.kind).toBe('not-integer');
  });

  test('zero → not ok, informative message', () => {
    const r = normalizeInput('0');
    expect(r.ok).toBe(false);
    expect(r.kind).toBe('zero');
    expect(r.message).toMatch(/infinitely many/i);
  });

  test('one → ok with kind=one', () => {
    expect(normalizeInput('1')).toEqual({ ok: true, value: 1, kind: 'one' });
  });

  test('negative → abs value + note explanation', () => {
    const r = normalizeInput('-72');
    expect(r.ok).toBe(true);
    expect(r.value).toBe(72);
    expect(r.kind).toBe('negative');
    expect(r.note).toMatch(/absolute value/i);
  });

  test('too large → rejected', () => {
    const r = normalizeInput('9999999999999');
    expect(r.ok).toBe(false);
    expect(r.kind).toBe('too-large');
  });
});

/* =========================================================
 * getFactors
 * ========================================================= */
describe('getFactors', () => {
  test('1 has one factor', () => {
    expect(getFactors(1)).toEqual([1]);
  });

  test('prime 2', () => {
    expect(getFactors(2)).toEqual([1, 2]);
  });

  test('prime 7', () => {
    expect(getFactors(7)).toEqual([1, 7]);
  });

  test('12', () => {
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
  });

  test('72 has exactly 12 factors', () => {
    expect(getFactors(72)).toEqual([1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72]);
  });

  test('100 (perfect square)', () => {
    expect(getFactors(100)).toEqual([1, 2, 4, 5, 10, 20, 25, 50, 100]);
  });

  test('720 (highly composite, 30 factors)', () => {
    const f = getFactors(720);
    expect(f.length).toBe(30);
    expect(f[0]).toBe(1);
    expect(f[f.length - 1]).toBe(720);
  });

  test('large prime 999983', () => {
    expect(getFactors(999983)).toEqual([1, 999983]);
  });

  test('returns sorted ascending with no duplicates', () => {
    const f = getFactors(360);
    for (let i = 1; i < f.length; i++) {
      expect(f[i]).toBeGreaterThan(f[i - 1]);
    }
  });

  test('invalid input → []', () => {
    expect(getFactors(0)).toEqual([]);
    expect(getFactors(-5)).toEqual([]);
    expect(getFactors(1.5)).toEqual([]);
  });
});

/* =========================================================
 * getFactorPairs
 * ========================================================= */
describe('getFactorPairs', () => {
  test('72 factor pairs', () => {
    expect(getFactorPairs(72)).toEqual([
      [1, 72], [2, 36], [3, 24], [4, 18], [6, 12], [8, 9],
    ]);
  });

  test('perfect square 36 includes the middle pair (6,6)', () => {
    const pairs = getFactorPairs(36);
    expect(pairs).toContainEqual([6, 6]);
  });

  test('prime has only (1, p)', () => {
    expect(getFactorPairs(13)).toEqual([[1, 13]]);
  });
});

/* =========================================================
 * getDivisorCount / getDivisorSum / getAliquotSum
 * OEIS A000005 and A000203 reference values
 * ========================================================= */
describe('divisor count / sum', () => {
  // A000005: 1, 2, 2, 3, 2, 4, 2, 4, 3, 4, 2, 6, ...
  test('count matches OEIS A000005 for n=1..12', () => {
    const expected = [1, 2, 2, 3, 2, 4, 2, 4, 3, 4, 2, 6];
    for (let i = 0; i < expected.length; i++) {
      expect(getDivisorCount(i + 1)).toBe(expected[i]);
    }
  });

  // A000203: 1, 3, 4, 7, 6, 12, 8, 15, 13, 18, 12, 28, ...
  test('sum matches OEIS A000203 for n=1..12', () => {
    const expected = [1, 3, 4, 7, 6, 12, 8, 15, 13, 18, 12, 28];
    for (let i = 0; i < expected.length; i++) {
      expect(getDivisorSum(i + 1)).toBe(expected[i]);
    }
  });

  test('sum of divisors of 72 = 195', () => {
    expect(getDivisorSum(72)).toBe(195);
  });

  test('aliquot sum of 6 = 6 (perfect)', () => {
    expect(getAliquotSum(6)).toBe(6);
  });

  test('aliquot sum of 28 = 28 (perfect)', () => {
    expect(getAliquotSum(28)).toBe(28);
  });

  test('aliquot sum of prime = 1', () => {
    expect(getAliquotSum(7)).toBe(1);
    expect(getAliquotSum(13)).toBe(1);
  });
});

/* =========================================================
 * Prime factorization
 * ========================================================= */
describe('getPrimeFactorization', () => {
  test('72 = 2^3 * 3^2', () => {
    expect(getPrimeFactorization(72)).toEqual([[2, 3], [3, 2]]);
  });

  test('prime 7', () => {
    expect(getPrimeFactorization(7)).toEqual([[7, 1]]);
  });

  test('100 = 2^2 * 5^2', () => {
    expect(getPrimeFactorization(100)).toEqual([[2, 2], [5, 2]]);
  });

  test('1 → []', () => {
    expect(getPrimeFactorization(1)).toEqual([]);
  });

  test('sorted by prime ascending', () => {
    const f = getPrimeFactorization(2310); // 2 * 3 * 5 * 7 * 11
    const primes = f.map(([p]) => p);
    expect(primes).toEqual([...primes].sort((a, b) => a - b));
  });

  test('reconstructs original number', () => {
    for (const n of [1, 2, 7, 12, 72, 100, 720, 999983, 123456]) {
      const prod = getPrimeFactorization(n).reduce(
        (acc, [p, e]) => acc * Math.pow(p, e),
        1
      );
      expect(prod || 1).toBe(n === 1 ? 1 : n);
    }
  });
});

describe('getPrimeFactorsList', () => {
  test('72 with multiplicity', () => {
    expect(getPrimeFactorsList(72)).toEqual([2, 2, 2, 3, 3]);
  });
});

describe('getDistinctPrimeFactors', () => {
  test('72 distinct primes', () => {
    expect(getDistinctPrimeFactors(72)).toEqual([2, 3]);
  });
});

describe('formatPrimeFactorization', () => {
  test('72 → 2³ × 3²', () => {
    expect(formatPrimeFactorization(72)).toBe('2³ × 3²');
  });
  test('12 → 2² × 3', () => {
    expect(formatPrimeFactorization(12)).toBe('2² × 3');
  });
  test('prime 7 → 7', () => {
    expect(formatPrimeFactorization(7)).toBe('7');
  });
  test('1 → 1', () => {
    expect(formatPrimeFactorization(1)).toBe('1');
  });
});

/* =========================================================
 * GCF / LCM / Common Factors
 * ========================================================= */
describe('getGCF', () => {
  test('two numbers', () => {
    expect(getGCF([12, 18])).toBe(6);
    expect(getGCF([48, 60])).toBe(12);
  });

  test('three numbers', () => {
    expect(getGCF([12, 18, 24])).toBe(6);
  });

  test('coprime → 1', () => {
    expect(getGCF([7, 13])).toBe(1);
  });

  test('with 0', () => {
    expect(getGCF([0, 12])).toBe(12);
  });

  test('negatives handled by abs', () => {
    expect(getGCF([-12, 18])).toBe(6);
  });

  test('empty → 0', () => {
    expect(getGCF([])).toBe(0);
  });
});

describe('getLCM', () => {
  test('two numbers', () => {
    expect(getLCM([4, 6])).toBe(12);
    expect(getLCM([12, 18])).toBe(36);
  });

  test('three numbers', () => {
    expect(getLCM([4, 6, 8])).toBe(24);
  });

  test('any zero → 0', () => {
    expect(getLCM([0, 12])).toBe(0);
  });

  test('empty → 0', () => {
    expect(getLCM([])).toBe(0);
  });
});

describe('getCommonFactors', () => {
  test('common factors of 12 and 18', () => {
    expect(getCommonFactors([12, 18])).toEqual([1, 2, 3, 6]);
  });

  test('coprime → [1]', () => {
    expect(getCommonFactors([7, 13])).toEqual([1]);
  });
});

/* =========================================================
 * Number properties
 * ========================================================= */
describe('isPrime', () => {
  test('known primes', () => {
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 73, 97, 999983].forEach((p) =>
      expect(isPrime(p)).toBe(true)
    );
  });

  test('known composites', () => {
    [4, 6, 8, 9, 12, 15, 25, 100, 720].forEach((c) =>
      expect(isPrime(c)).toBe(false)
    );
  });

  test('edge: 0, 1, negatives', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-7)).toBe(false);
  });
});

describe('isPerfect / isAbundant / isDeficient', () => {
  test('perfect numbers: 6, 28, 496, 8128', () => {
    [6, 28, 496, 8128].forEach((n) => expect(isPerfect(n)).toBe(true));
  });

  test('12 is abundant (aliquot 16 > 12)', () => {
    expect(isAbundant(12)).toBe(true);
    expect(isDeficient(12)).toBe(false);
  });

  test('primes are deficient', () => {
    [7, 13, 29].forEach((p) => expect(isDeficient(p)).toBe(true));
  });
});

describe('isPerfectSquare / isPerfectCube', () => {
  test('perfect squares', () => {
    [1, 4, 9, 16, 25, 36, 100, 144, 10000].forEach((n) =>
      expect(isPerfectSquare(n)).toBe(true)
    );
  });

  test('non-squares', () => {
    [2, 3, 5, 8, 72, 99].forEach((n) => expect(isPerfectSquare(n)).toBe(false));
  });

  test('perfect cubes', () => {
    [1, 8, 27, 64, 125, 1000].forEach((n) => expect(isPerfectCube(n)).toBe(true));
  });
});

describe('isEven / isOdd', () => {
  test('parity basics', () => {
    expect(isEven(72)).toBe(true);
    expect(isOdd(73)).toBe(true);
    expect(isEven(0)).toBe(true);
  });
});

/* =========================================================
 * Factor tree
 * ========================================================= */
describe('buildFactorTree', () => {
  test('prime is a leaf', () => {
    expect(buildFactorTree(7)).toEqual({ value: 7 });
  });

  test('12 splits into 2 × 6, then 6 → 2 × 3', () => {
    const t = buildFactorTree(12);
    expect(t.value).toBe(12);
    expect(t.left.value).toBe(2);
    expect(t.right.value).toBe(6);
    expect(t.right.left.value).toBe(2);
    expect(t.right.right.value).toBe(3);
  });

  test('tree leaves multiply back to n', () => {
    const collectLeaves = (node) => {
      if (!node.left && !node.right) return [node.value];
      return [...collectLeaves(node.left), ...collectLeaves(node.right)];
    };
    for (const n of [12, 72, 100, 360]) {
      const leaves = collectLeaves(buildFactorTree(n));
      const product = leaves.reduce((a, b) => a * b, 1);
      expect(product).toBe(n);
    }
  });
});

/* =========================================================
 * Steps
 * ========================================================= */
describe('getPrimeFactorizationSteps', () => {
  test('72 steps', () => {
    const s = getPrimeFactorizationSteps(72);
    expect(s.length).toBe(5); // 2,2,2,3,3
    expect(s[0]).toEqual({ dividend: 72, divisor: 2, quotient: 36 });
    expect(s[s.length - 1].quotient).toBe(1);
  });
});

/* =========================================================
 * Related numbers
 * ========================================================= */
describe('getRelatedNumbers', () => {
  test('72 related includes prev, next, half, double, primes, squares', () => {
    const r = getRelatedNumbers(72);
    expect(r).toEqual(expect.arrayContaining([71, 73, 36, 144, 2, 3, 64, 81]));
  });

  test('sorted ascending, unique', () => {
    const r = getRelatedNumbers(72);
    for (let i = 1; i < r.length; i++) {
      expect(r[i]).toBeGreaterThan(r[i - 1]);
    }
  });

  test('respects max bound', () => {
    const r = getRelatedNumbers(1000, { max: 1200 });
    expect(r.every((x) => x <= 1200)).toBe(true);
  });
});
