import Link from '@/link';
import { TLinkOptions } from '@/link/types';

type Overrides = Partial<TLinkOptions>;

const getMockEntries = (name: string) => ['music', 'jazz', 'miles', `${name}.tsx`];

const getOpts = (overrides: Overrides): TLinkOptions => ({
    convertCamelCase: false,
    convertHyphens: false,
    ...overrides,
});

const getInstance = (name: string, overrides?: Overrides | undefined, mocks?: string[]): Link => {
    return new Link(
        mocks ? mocks : getMockEntries(name),
        overrides ? getOpts(overrides) : undefined
    );
};

describe('@link', () => {
    test('handles standard file', () => {
        const link = getInstance('davis');
        expect(link.key).toEqual('MUSIC_JAZZ_MILES_DAVIS');
        expect(link.value).toEqual('/music/jazz/miles/davis');
    });
    test('handles index file', () => {
        const link = getInstance('index');
        expect(link.key).toEqual('MUSIC_JAZZ_MILES');
        expect(link.value).toEqual('/music/jazz/miles');
    });
    test('handles catchall file', () => {
        const link = getInstance('[...davis]');
        expect(link.key).toEqual('MUSIC_JAZZ_MILES_CATCHALL_DAVIS');
        expect(link.value).toEqual('/music/jazz/miles/[...davis]');
    });
    test('handles optional catchall file', () => {
        const link = getInstance('[[...davis]]');
        expect(link.key).toEqual('MUSIC_JAZZ_MILES_OPTIONAL_CATCHALL_DAVIS');
        expect(link.value).toEqual('/music/jazz/miles/[[...davis]]');
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

    test('handles optional catchall file with entries', () => {
        const link = getInstance('[[...davis]]', undefined, ['[[...davis]]']);
        expect(link.key).toEqual('OPTIONAL_CATCHALL_DAVIS');
        expect(link.value).toEqual('/[[...davis]]');
    });

    test('handles standard file without entries', () => {
        const link = getInstance('', undefined, []);
        expect(link.key).toEqual('');
        expect(link.value).toEqual('');
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
