/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        ink: {
          DEFAULT: '#111827',
          soft: '#374151',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F9FAFB',
          alt: '#F3F4F6',
          border: '#E5E7EB',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.7' }],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      maxWidth: {
        'prose-wide': '48rem',
        'content': '75rem',
      },
      screens: {
        'xs': '375px',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 60%, #F9FAFB 100%)',
      },
    },
  },
  plugins: [],
};