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
        external: ['prettier'],
        plugins: [
            cleaner({
                targets: ['./dist'],
            }),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
            }),
            terser(),
        ],
    };
};
