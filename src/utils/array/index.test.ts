import { getLastInArray } from '.';

describe('@utils/array', () => {
    test('can get last of array if defined', () => {
        expect(getLastInArray(['a', 'b', 'c'])).toEqual('c');
    });

    test('returns null if last of array is not defined', () => {
        expect(getLastInArray([])).toEqual(null);
    });
});
