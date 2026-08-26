/**
 * Animated math symbols — light gray, blurred, 50 symbols.
 * Reduced from 100 for better performance (half the CPU/GPU load,
 * visually indistinguishable because of blur and low opacity).
 */
export default function MathBackdrop() {
    return (
        <div
            className="math-backdrop pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
        >
            {SYMBOLS.map((s, i) => (
                <span
                    key={i}
                    className="math-symbol"
                    style={{
                        left: `${s.left}%`,
                        fontSize: `${s.size}rem`,
                        opacity: s.opacity,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`,
                        fontWeight: s.weight,
                    }}
                >
                    {s.text}
                </span>
            ))}
        </div>
    );
}

const SYMBOLS = [
    { text: '7', left: 4, size: 2.0, opacity: 0.55, duration: 34, delay: 0, weight: 700 },
    { text: '12', left: 11, size: 2.4, opacity: 0.50, duration: 40, delay: 3, weight: 700 },
    { text: '×', left: 8, size: 2.8, opacity: 0.55, duration: 30, delay: 7, weight: 400 },
    { text: '3', left: 19, size: 1.6, opacity: 0.60, duration: 28, delay: 11, weight: 600 },
    { text: 'π', left: 15, size: 2.6, opacity: 0.50, duration: 44, delay: 15, weight: 500 },
    { text: '9', left: 27, size: 2.2, opacity: 0.55, duration: 42, delay: 2, weight: 700 },
    { text: '÷', left: 22, size: 2.6, opacity: 0.55, duration: 34, delay: 18, weight: 400 },
    { text: '24', left: 35, size: 1.8, opacity: 0.55, duration: 38, delay: 5, weight: 700 },
    { text: '√', left: 31, size: 2.8, opacity: 0.50, duration: 30, delay: 22, weight: 400 },
    { text: '5', left: 43, size: 2.0, opacity: 0.55, duration: 32, delay: 9, weight: 700 },
    { text: '+', left: 38, size: 2.4, opacity: 0.55, duration: 28, delay: 25, weight: 400 },
    { text: '36', left: 51, size: 2.2, opacity: 0.55, duration: 42, delay: 5, weight: 700 },
    { text: '∞', left: 46, size: 2.4, opacity: 0.55, duration: 36, delay: 1, weight: 400 },
    { text: '=', left: 54, size: 2.2, opacity: 0.60, duration: 42, delay: 19, weight: 400 },
    { text: '48', left: 59, size: 1.8, opacity: 0.55, duration: 36, delay: 21, weight: 700 },
    { text: '∑', left: 62, size: 2.6, opacity: 0.50, duration: 40, delay: 11, weight: 400 },
    { text: '17', left: 67, size: 2.0, opacity: 0.55, duration: 40, delay: 9, weight: 700 },
    { text: '−', left: 70, size: 2.6, opacity: 0.55, duration: 36, delay: 14, weight: 400 },
    { text: '100', left: 75, size: 1.6, opacity: 0.55, duration: 46, delay: 16, weight: 700 },
    { text: 'Δ', left: 78, size: 2.0, opacity: 0.60, duration: 28, delay: 23, weight: 500 },
    { text: '11', left: 83, size: 2.2, opacity: 0.55, duration: 34, delay: 23, weight: 700 },
    { text: '∫', left: 86, size: 2.6, opacity: 0.55, duration: 34, delay: 13, weight: 400 },
    { text: '2', left: 91, size: 2.4, opacity: 0.55, duration: 38, delay: 6, weight: 700 },
    { text: '≈', left: 94, size: 2.4, opacity: 0.55, duration: 38, delay: 20, weight: 400 },
    { text: '15', left: 98, size: 1.8, opacity: 0.55, duration: 36, delay: 30, weight: 700 },
    { text: '2³×3²', left: 6, size: 1.3, opacity: 0.75, duration: 46, delay: 5, weight: 600 },
    { text: '8', left: 14, size: 2.0, opacity: 0.55, duration: 32, delay: 31, weight: 700 },
    { text: '4×6=24', left: 26, size: 1.2, opacity: 0.75, duration: 42, delay: 17, weight: 600 },
    { text: '60', left: 20, size: 1.8, opacity: 0.55, duration: 40, delay: 33, weight: 700 },
    { text: 'GCF', left: 40, size: 1.4, opacity: 0.75, duration: 38, delay: 8, weight: 700 },
    { text: '45', left: 44, size: 1.6, opacity: 0.55, duration: 38, delay: 35, weight: 700 },
    { text: 'LCM', left: 54, size: 1.4, opacity: 0.75, duration: 44, delay: 21, weight: 700 },
    { text: '144', left: 56, size: 1.6, opacity: 0.55, duration: 44, delay: 37, weight: 700 },
    { text: 'prime', left: 68, size: 1.2, opacity: 0.75, duration: 40, delay: 3, weight: 600 },
    { text: '13', left: 64, size: 2.0, opacity: 0.55, duration: 34, delay: 39, weight: 700 },
    { text: '12=2²×3', left: 82, size: 1.2, opacity: 0.75, duration: 48, delay: 27, weight: 600 },
    { text: '72', left: 78, size: 2.0, opacity: 0.55, duration: 34, delay: 11, weight: 700 },
    { text: '1,2,3,6', left: 96, size: 1.1, opacity: 0.75, duration: 40, delay: 15, weight: 500 },
    { text: 'HCF', left: 90, size: 1.4, opacity: 0.75, duration: 44, delay: 6, weight: 700 },
    { text: '²', left: 32, size: 2.4, opacity: 0.55, duration: 32, delay: 26, weight: 700 },
    { text: '³', left: 72, size: 2.4, opacity: 0.55, duration: 36, delay: 1, weight: 700 },
    { text: 'factor', left: 60, size: 1.2, opacity: 0.75, duration: 40, delay: 24, weight: 600 },
    { text: '18', left: 12, size: 1.8, opacity: 0.55, duration: 34, delay: 41, weight: 700 },
    { text: '81', left: 76, size: 1.6, opacity: 0.55, duration: 42, delay: 43, weight: 700 },
    { text: '32', left: 84, size: 1.8, opacity: 0.55, duration: 36, delay: 47, weight: 700 },
    { text: '25', left: 92, size: 1.6, opacity: 0.55, duration: 38, delay: 51, weight: 700 },
    { text: '2×3×5', left: 20, size: 1.2, opacity: 0.75, duration: 42, delay: 28, weight: 600 },
    { text: '6×8=48', left: 48, size: 1.2, opacity: 0.75, duration: 38, delay: 29, weight: 600 },
    { text: '50', left: 5, size: 1.6, opacity: 0.55, duration: 36, delay: 56, weight: 700 },
    { text: 'divisor', left: 42, size: 1.1, opacity: 0.75, duration: 44, delay: 40, weight: 600 },
];