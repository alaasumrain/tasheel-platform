const { defineConfig } = require('vitest/config');
const { resolve } = require('path');

module.exports = defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    restoreMocks: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
});
