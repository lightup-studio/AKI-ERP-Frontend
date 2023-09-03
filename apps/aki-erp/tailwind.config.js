const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, '{app,pages,components,utils}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/storybook-ui/src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      themes: ["light", "dark", "cupcake"],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
