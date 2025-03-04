/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      fontSize: {
        'xs': '0.65rem',
        'sm': '0.75rem',
        'base': '0.85rem',
        'lg': '1rem',
        'xl': '1.15rem',
        '2xl': '1.35rem',
        '3xl': '1.65rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      letterSpacing: {
        'tighter': '-0.01em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.00625rem',
        'wider': '0.01rem',
        'widest': '0.025rem',
      },
      lineHeight: {
        'tight': '1.2',
        'snug': '1.4',
        'normal': '1.6',
        'relaxed': '1.8',
        'loose': '2',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 