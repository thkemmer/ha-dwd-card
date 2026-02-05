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
  },
});
