import RootLink from '@/link/root-link';

describe('@link/root-link', () => {
    test.each([
        ['/', 'ROOT', '/'],
        ['/test', 'TEST_ROOT', '/test'],
        ['/another/test-there', 'ANOTHER_TEST_THERE_ROOT', '/another/test-there'],
    ])('can handle root link with base %s', (base, expectedKey, expectedValue) => {
        const root = new RootLink({ base, convertHyphens: true });
        expect(root.key).toEqual(expectedKey);
        expect(root.value).toEqual(expectedValue);
    });
});
