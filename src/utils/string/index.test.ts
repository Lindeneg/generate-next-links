import {
    getRunTimeInSeconds,
    removeTargetExtension,
    convertCamelCase,
    convertHyphens,
    prefixStringIfNumber,
    prefixStringIfNotContainedInStart,
} from '@/utils/string';

describe('@utils/string', () => {
    describe('removeTargetExtension', () => {
        test.each([
            ['tsx', 'hello.tsx', 'hello'],
            ['jsx', 'hello.jsx', 'hello'],
            ['ts', 'hello.ts', 'hello'],
            ['js', 'hello.js', 'hello'],
            ['invalid', 'hello.invalid', 'hello.invalid'],
        ])('handles %s extension', (_, target, expected) => {
            expect(removeTargetExtension(target)).toEqual(expected);
        });
    });

    describe('convertCamelCase', () => {
        test.each([
            ['helloThere', 'hello_There'],
            ['multiWordCamelCase', 'multi_Word_Camel_Case'],
            ['hello-there', 'hello-there'],
            ['Hello There', 'Hello There'],
        ])('handles %s', (target, expected) => {
            expect(convertCamelCase(target)).toEqual(expected);
        });
    });

    describe('convertHyphens', () => {
        test.each([
            ['hello-there', 'hello_there'],
            ['multi-word-kebab-case', 'multi_word_kebab_case'],
        ])('handles %s', (target, expected) => {
            expect(convertHyphens(target)).toEqual(expected);
        });
    });

    describe('prefixStringWithSeparator', () => {
        test.each([
            ['CL', 'C', 'CL'],
            ['L', 'C', 'CL'],
        ])('handles %s', (target, prefix, expected) => {
            expect(prefixStringIfNotContainedInStart(target, prefix)).toEqual(expected);
        });
    });

    describe('prefixStringIfNumber', () => {
        test.each([
            ['500', undefined, 'N500'],
            ['500', 'P', 'P500'],
            ['something', '', 'something'],
        ])('handles %s', (target, prefix, expected) => {
            expect(prefixStringIfNumber(target, prefix)).toEqual(expected);
        });
    });

    describe('getRunTimeInSeconds', () => {
        const start = Date.now() - 1000;
        test('can get runtime', () => {
            expect(getRunTimeInSeconds(start).split('.')[0]).toEqual('1');
        });
    });
});
