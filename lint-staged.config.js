module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx}': files => {
    return `nx affected --target=typecheck --files=${files.map(file => `'${file}'`).join(',')}`;
  },
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': [
    files => `nx affected:lint --files=${files.map(file => `'${file}'`).join(',')}`,
    files => `nx format:write --files=${files.map(file => `'${file}'`).join(',')}`,
  ],
  };