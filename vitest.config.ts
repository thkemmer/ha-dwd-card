import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
