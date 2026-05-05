/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Heebo', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
        accent: {
          pink: '#EC4899',
          amber: '#F59E0B',
          violet: '#8B5CF6',
        },
        ink: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50:  '#F8FAFC',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
        'mesh': 'radial-gradient(at 0% 0%, #8B5CF6 0px, transparent 50%), radial-gradient(at 98% 0%, #EC4899 0px, transparent 50%), radial-gradient(at 50% 100%, #F59E0B 0px, transparent 50%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(168, 85, 247, 0.45)',
        soft: '0 10px 30px -10px rgba(15, 23, 42, 0.15)',
        card: '0 4px 16px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
