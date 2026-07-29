/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core luxury palette
        noir: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        // Rich gold with metallic feel
        gold: {
          50: '#fdf9ef',
          100: '#f9efd3',
          200: '#f2dca5',
          300: '#e9c46a',
          400: '#e2b23e',
          500: '#d4991a',
          600: '#c9a84c',
          700: '#a67c28',
          800: '#876325',
          900: '#6f5122',
          DEFAULT: '#c9a84c',
          light: '#e8d5a3',
          dark: '#a67c28',
          metallic: 'linear-gradient(135deg, #c9a84c 0%, #e8d5a3 50%, #c9a84c 100%)',
        },
        // Burgundy/Wine for luxury accents
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0da',
          300: '#f4a9bc',
          400: '#ec7698',
          500: '#df4876',
          600: '#cc2d63',
          700: '#ab1f52',
          800: '#8f1d48',
          900: '#7a1c42',
          DEFAULT: '#7a1c42',
        },
        // Deep emerald for richness
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#065f46',
        },
        // Cream/Ivory for text
        ivory: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#faf3e0',
          300: '#f5e6c8',
          400: '#edd5a3',
          500: '#e2c080',
          DEFAULT: '#fdf9f0',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        accent: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a84c 0%, #e8d5a3 50%, #c9a84c 100%)',
        'gradient-dark-gold': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d1f0f 100%)',
        'gradient-wine': 'linear-gradient(135deg, #7a1c42 0%, #ab1f52 100%)',
        'pattern-arabic': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23c9a84c' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E\")",
        'pattern-ornate': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23c9a84c' stroke-width='0.3' opacity='0.08'/%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23c9a84c' stroke-width='0.3' opacity='0.08'/%3E%3Ccircle cx='40' cy='40' r='10' fill='none' stroke='%23c9a84c' stroke-width='0.3' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(201, 168, 76, 0.15)',
        'luxury-lg': '0 35px 60px -15px rgba(201, 168, 76, 0.2)',
        'gold-glow': '0 0 40px rgba(201, 168, 76, 0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(232, 213, 163, 0.1)',
        'card-luxury': '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 168, 76, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
