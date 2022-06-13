import walk from '@/walk';
import generateLinks from '.';
import * as utils from '@/generate-links/utils';
import { cast } from '@/utils';

jest.mock('@/generate-links/utils');
jest.mock('@/link');
jest.mock('@/walk');

const mockedWalk = jest.mocked(walk);
const mockedUtils = jest.mocked(utils);

describe('@generate-links', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('can generate links correctly', async () => {
        mockedUtils.getRegex.mockImplementation(cast(() => /some-regex/));
        mockedWalk.mockImplementation(async () => ['/hello/there/index.tsx']);
        const config = {
            api: false,
            path: './hello/there',
            nativeSeparator: '/',
            convertCamelCase: false,
            convertHyphens: false,
        };
        await generateLinks(cast(config));

        expect(mockedWalk).toHaveBeenCalledTimes(1);
        expect(mockedWalk).toHaveBeenCalledWith(config.api, config.path, config.nativeSeparator);

        expect(mockedUtils.handleEntry).toHaveBeenCalledTimes(1);
        expect(mockedUtils.handleEntry).toHaveBeenCalledWith(
            {
                regex: /some-regex/,
                links: [],
                separator: '/',
                config: { convertCamelCase: false, convertHyphens: false },
            },
            '/hello/there/index.tsx'
        );
    });
});
