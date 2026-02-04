import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const isDev = process.env.DEV === 'true';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: isDev ? 'ha-dwd-card-dev.js' : 'ha-dwd-card.js',
    format: 'es',
    sourcemap: true,
  },
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        '__DEV__': isDev ? 'true' : 'false'
      }
    }),
    resolve({
      dedupe: ['lit']
    }),
    json(),
    typescript(),
    !isDev && terser(),
  ],
};
