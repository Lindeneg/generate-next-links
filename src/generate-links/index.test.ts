import walk from '@/walk';
import RootLink from '@/link/root-link';
import * as utils from '@/generate-links/utils';
import { cast } from '@/utils';
import generateLinks from '.';

jest.mock('@/generate-links/utils');
jest.mock('@/link');
jest.mock('@/link/root-link');
jest.mock('@/walk');

const mockedWalk = jest.mocked(walk);
const mockedUtils = jest.mocked(utils);
const mockedRootLink = jest.mocked(RootLink);

describe('@generate-links', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test.each(['with', 'without'])('can generate links correctly %s root', async (mode) => {
        const withRoot = mode === 'with' ? 1 : 0;
        const mockedLink = { key: 'some', value: 'some-value' };
        mockedRootLink.mockImplementation(() => cast(mockedLink));
        mockedUtils.getRegex.mockImplementation(cast(() => /some-regex/));
        mockedWalk.mockImplementation(async () => ['/hello/there/index.tsx']);
        const coreConfig = { convertCamelCase: false, convertHyphens: false, base: '/' };
        const config = {
            api: false,
            path: './hello/there',
            nativeSeparator: '/',
            root: !!withRoot,
            ...coreConfig,
        };
        await generateLinks(cast(config));

        expect(mockedWalk).toHaveBeenCalledTimes(1);
        expect(mockedWalk).toHaveBeenCalledWith(config.api, config.path, config.nativeSeparator);
        expect(mockedRootLink).toHaveBeenCalledTimes(withRoot);
        withRoot && expect(mockedRootLink).toHaveBeenCalledWith(coreConfig);
        expect(mockedUtils.handleEntry).toHaveBeenCalledTimes(1);
        expect(mockedUtils.handleEntry).toHaveBeenCalledWith(
            {
                regex: /some-regex/,
                links: withRoot ? [mockedLink] : [],
                separator: '/',
                config: coreConfig,
            },
            '/hello/there/index.tsx'
        );
    });
});
