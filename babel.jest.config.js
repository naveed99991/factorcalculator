// Babel config used ONLY by Jest (referenced from jest.config.js).
// Named non-standard so Next.js does NOT auto-detect it and disable SWC.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
};
