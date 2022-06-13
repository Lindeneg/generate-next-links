/* eslint-disable no-undef */
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default () => {
    return {
        input: './src/index.ts',
        output: [
            {
                file: './dist/bundle.min.js',
                format: 'cjs',
            },
        ],
        external: ['prettier', '@cl-live-server/logger'],
        plugins: [
            cleaner({
                targets: ['./dist'],
            }),
            resolve({ preferBuiltins: true }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
            }),
            terser(),
        ],
    };
};
