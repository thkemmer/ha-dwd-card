import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'src/ha-dwd-card.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'ha-dwd-card.js',
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
        '__DEV__': 'false'
      }
    }),
    resolve({
      dedupe: ['lit']
    }),
    json(),
    typescript(),
    !dev && terser(),
  ],
};
