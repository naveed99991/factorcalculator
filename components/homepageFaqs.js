/**
 * 15 FAQs for the Factor Calculator homepage.
 * Each answer is self-contained (AEO-optimized) — readable out of context,
 * with specific numbers/facts so AI assistants can cite them directly.
 *
 * Questions sourced from real "People Also Ask" data (Ahrefs/Semrush export).
 */
export const HOMEPAGE_FAQS = [
    {
        question: 'What is a factor of a number?',
        answer:
            'A factor of a number is a whole number that divides it exactly, leaving no remainder. For example, the factors of 12 are 1, 2, 3, 4, 6, and 12 — because 12 can be divided evenly by each of these numbers. Every whole number greater than 1 has at least two factors: 1 and itself.',
    },
    {
        question: 'How do you find the factors of a number?',
        answer:
            'To find the factors of a number, divide it by every whole number from 1 up to its square root. If the division has no remainder, both the divisor and the quotient are factors. For example, for 36: 1×36, 2×18, 3×12, 4×9, and 6×6 — so its factors are 1, 2, 3, 4, 6, 9, 12, 18, and 36. This is called the trial division method, and it works for any positive integer.',
    },
    {
        question: 'What is a factor pair?',
        answer:
            'A factor pair is two whole numbers that multiply together to give a specific number. For example, the factor pairs of 24 are (1, 24), (2, 12), (3, 8), and (4, 6) — each pair multiplies to 24. Every number has at least one factor pair (1 × the number itself). Perfect squares like 36 have an extra middle pair where both numbers are the same, such as (6, 6).',
    },
    {
        question: 'How do I figure out the factors of a number quickly?',
        answer:
            'The fastest way is to check divisibility by small primes first: 2, 3, 5, 7, 11. Only check up to the square root of the number — every factor above the square root has a matching factor below it. For example, to find factors of 100, you only need to test 1 through 10; the factors above 10 (like 20, 25, 50, 100) are found automatically as pairs. This reduces work dramatically for large numbers.',
    },
    {
        question: 'What is factorization of a number?',
        answer:
            'Factorization is the process of breaking a number down into a product of smaller numbers, usually its factors or prime factors. For example, the factorization of 12 can be written as 2 × 6, 3 × 4, or in prime form as 2 × 2 × 3 (or 2² × 3). Prime factorization is unique for every number — this is called the Fundamental Theorem of Arithmetic.',
    },
    {
        question: 'How do you calculate prime factors?',
        answer:
            'To calculate prime factors, repeatedly divide the number by the smallest prime that divides it, until you reach 1. For example, for 60: 60 ÷ 2 = 30, 30 ÷ 2 = 15, 15 ÷ 3 = 5, 5 ÷ 5 = 1. The prime factors are 2, 2, 3, 5 — written in exponent form as 2² × 3 × 5. This method is called the division method or ladder method.',
    },
    {
        question: 'What is the difference between factors and multiples?',
        answer:
            'A factor divides a number evenly, while a multiple is the result of multiplying a number by an integer. For example, the factors of 12 are 1, 2, 3, 4, 6, and 12 (numbers that divide 12), while the multiples of 12 are 12, 24, 36, 48, 60, and so on (numbers you get by multiplying 12 by 1, 2, 3, 4, 5, ...). Factors are always less than or equal to the number; multiples are always greater than or equal to it.',
    },
    {
        question: 'Can a negative number be a factor?',
        answer:
            'Yes, mathematically every positive integer has both positive and negative factors. For example, the factors of 12 include −1, −2, −3, −4, −6, −12 in addition to 1, 2, 3, 4, 6, 12. However, in everyday math, school, and most calculators (including this one), only positive factors are listed by default, because they cover every meaningful divisor without duplication.',
    },
    {
        question: 'What multiplies to give a number?',
        answer:
            'The pairs of whole numbers that multiply to give a specific number are called its factor pairs. For example, numbers that multiply to give 24 are: 1 × 24, 2 × 12, 3 × 8, and 4 × 6. To find these for any number, you list its factors and pair each factor with its matching quotient. Every whole number has at least one such pair.',
    },
    {
        question: 'How do you find all the factors of a number in one go?',
        answer:
            'The most efficient method is to loop through every integer from 1 to the square root of the number. Each time you find a divisor with no remainder, add both the divisor and its quotient to your list. Finally, sort the list. For example, for 72, you check 1, 2, 3, 4, 5, 6, 7, 8 — the divisors are 1, 2, 3, 4, 6, 8 and their pairs are 72, 36, 24, 18, 12, 9. Combined and sorted: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72 — exactly 12 factors.',
    },
    {
        question: 'What is the difference between a factor and a prime factor?',
        answer:
            'A factor is any whole number that divides another number exactly. A prime factor is a factor that is also a prime number — meaning it can only be divided by 1 and itself. For example, the factors of 12 are 1, 2, 3, 4, 6, and 12, but only 2 and 3 are prime factors. Every composite number can be expressed as a product of its prime factors in exactly one way.',
    },
    {
        question: 'What are common factors and the greatest common factor (GCF)?',
        answer:
            'Common factors are numbers that divide two or more given numbers exactly. The greatest common factor (GCF), also called HCF, is the largest of these common factors. For example, the common factors of 12 and 18 are 1, 2, 3, and 6 — so their GCF is 6. The GCF is useful for simplifying fractions and solving problems involving grouping.',
    },
    {
        question: 'What is a factor in math versus a factor in algebra?',
        answer:
            'In basic math, a factor is a whole number that divides another whole number exactly, like 3 being a factor of 12. In algebra, a factor is any expression that multiplies with others to form a bigger expression — for example, (x + 2) and (x − 2) are factors of x² − 4. This calculator focuses on number factors (arithmetic factoring), not algebraic expression factoring.',
    },
    {
        question: 'Why do we need to find factors of a number?',
        answer:
            'Finding factors is used in many real-world and academic tasks: simplifying fractions, finding the greatest common factor (GCF) and least common multiple (LCM), solving divisibility problems, grouping items evenly, cryptography (RSA relies on prime factorization), and scheduling problems. Understanding factors is a foundation for algebra, number theory, and computer science.',
    },
    {
        question: 'What are the smallest and largest factors of any number?',
        answer:
            'The smallest factor of any positive whole number is always 1, and the largest factor is always the number itself. For example, for 100 the smallest factor is 1 and the largest is 100. Between these two, other factors exist depending on whether the number is prime (only 1 and itself) or composite (has additional factors in between).',
    },
];