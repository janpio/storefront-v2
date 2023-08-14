module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ualert: '#FF00C7',
        charyo: '#1F1F1F',
        notpurple: '#F9F8FC',
        purps: '#7e18ff',
        purplehaze: '#b8b2ff',
        lamegray: '#d9d9d9',
        lavender: '#97B1FA'
      },
      width: {
        '38': '9.5rem',
        '112': '28rem',
        '135': '33.75rem',
        '137': '34.25rem',
        '150': '37.5rem',
        '152': '38rem',
      },
      height: {
        '38': '9.5rem',
        '112': '28rem',
        '135': '33.75rem',
        '137': '34.25rem',
        '150': '37.5rem',
        '152': '38rem',
      },
      spacing: {
        '80': '20rem',
      },
      translate: {
        '1/2': '50%',
      },
      inset: {
        '1/2': '50%'
      }
    },
    variants: {
      extend: {
        visibility: ['hover', 'focus'],
      },
    },
    plugins: [],
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
