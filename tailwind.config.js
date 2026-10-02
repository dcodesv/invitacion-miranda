/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#0F3885',
          dark: '#082255',
          light: '#245ABF',
          soft: '#E8EFFB',
        },
        lemon: {
          DEFAULT: '#F5C623',
          bright: '#FFE500',
          dark: '#D99B00',
          light: '#FFF9E5',
        },
        sage: {
          DEFAULT: '#4A6B52',
          dark: '#3A4E42',
          light: '#A3B8AA',
          soft: '#F0F4F1',
        },
        porcelain: {
          DEFAULT: '#FAF8F3',
          dark: '#F0EBE1',
          pure: '#FFFFFF',
        },
        rockPink: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          DEFAULT: '#70C5F8',
          400: '#70C5F8',
          500: '#38BDF8',
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#0369A1',
          900: '#0C4A6E',
          950: '#041D33',
        },
        rockBlue: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          DEFAULT: '#70C5F8',
          400: '#70C5F8',
          500: '#38BDF8',
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#0369A1',
          900: '#0C4A6E',
          950: '#041D33',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'chinoiserie': '0 20px 40px -15px rgba(15, 56, 133, 0.15), 0 0 15px rgba(0, 0, 0, 0.05)',
        'lemon-glow': '0 10px 25px -5px rgba(245, 198, 35, 0.4)',
        'tile': '0 4px 20px rgba(15, 56, 133, 0.08)',
      },
      backgroundImage: {
        'tile-pattern': "radial-gradient(#0F3885 0.75px, transparent 0.75px), radial-gradient(#4A6B52 0.75px, #FAF8F3 0.75px)",
      }
    },
  },
  plugins: [],
}
