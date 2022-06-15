import Link from '@/link';
import { TLinkOptions } from '@/link/types';

type Overrides = Partial<TLinkOptions>;

const getMockEntries = (name: string) => ['music', 'jazz', 'miles', `${name}.tsx`];

const getOpts = (overrides: Overrides = {}): TLinkOptions => ({
    convertCamelCase: false,
    convertHyphens: false,
    base: '/',
    ...overrides,
});

const getInstance = (name: string, overrides?: Overrides | undefined, mocks?: string[]): Link => {
    return new Link(mocks ? mocks : getMockEntries(name), getOpts(overrides));
};

describe('@link', () => {
    test.each([
        ['standard', 'davis', '_DAVIS'],
        ['index', 'index', ''],
        ['catchall', '[...davis]', '_CATCHALL_DAVIS'],
        ['optional catchall', '[[...davis]]', '_OPTIONAL_CATCHALL_DAVIS'],
    ])('handles %s file', (_, name, expected) => {
        const link = getInstance(name);
        const suffixName = name === 'index' ? '' : '/' + name;
        expect(link.key).toEqual('MUSIC_JAZZ_MILES' + expected);
        expect(link.value).toEqual('/music/jazz/miles' + suffixName);
    });

    test('handles standard file with conversions', () => {
        const link = getInstance('[[...davis]]', { convertCamelCase: true, convertHyphens: true }, [
            'helloThere',
            'good-sir.tsx',
        ]);
        expect(link.key).toEqual('HELLO_THERE_GOOD_SIR');
        expect(link.value).toEqual('/helloThere/good-sir');
    });

    test('handles standard file without conversions', () => {
        const link = getInstance(
            '[[...davis]]',
            { convertCamelCase: false, convertHyphens: false },
            ['helloThere', 'good-sir.tsx']
        );
        expect(link.key).toEqual('HELLOTHERE_GOODSIR');
        expect(link.value).toEqual('/helloThere/good-sir');
    });

    test.each([
        [
            '/some-base/path',
            'SOME_BASE_PATH_HELLOTHERE_GOOD_SIR',
            '/some-base/path/helloThere/good-sir',
        ],
        ['someBase', 'SOMEBASE_HELLOTHERE_GOOD_SIR', '/someBase/helloThere/good-sir'],
        ['/another/base/', 'ANOTHER_BASE_HELLOTHERE_GOOD_SIR', '/another/base/helloThere/good-sir'],
        ['/', 'HELLOTHERE_GOOD_SIR', '/helloThere/good-sir'],
    ])('handles %s base', (base, expectedKey, expectedValue) => {
        const link = getInstance(
            '[[...davis]]',
            { convertCamelCase: false, convertHyphens: true, base },
            ['helloThere', 'good-sir.tsx']
        );
        expect(link.key).toEqual(expectedKey);
        expect(link.value).toEqual(expectedValue);
    });

    test('handles optional catchall file with entries', () => {
        const link = getInstance('[[...davis]]', undefined, ['[[...davis]]']);
        expect(link.key).toEqual('OPTIONAL_CATCHALL_DAVIS');
        expect(link.value).toEqual('/[[...davis]]');
    });

    test('handles standard file without entries', () => {
        const link = getInstance('', undefined, []);
        expect(link.key).toEqual('');
        expect(link.value).toEqual('/');
    });

    test('handles toString call correctly', () => {
        const link = getInstance('[[...davis]]');
        expect(link.toString()).toMatchInlineSnapshot(`
      "{
          \\"name\\": \\"MUSIC_JAZZ_MILES_OPTIONAL_CATCHALL_DAVIS\\",
          \\"link\\": \\"/music/jazz/miles/[[...davis]]\\"
      }"
    `);
    });
});
