import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __DEV__: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    deps: {
      optimizer: {
        web: {
          include: ['lit', 'lit-html', 'lit-element'],
        },
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/types.d.ts', 'src/index.ts'],
      all: true,
    },
  },
});
