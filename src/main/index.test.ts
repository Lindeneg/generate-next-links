import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import getConfig from '@/get-config';
import generateLinks from '@/generate-links';
import writeFile from '@/write-file';
import { getRunTimeInSeconds } from '@/utils';
import main from '@/main';

const cast = <T>(arg: unknown): T => {
    return <T>arg;
};

jest.mock('@cl-live-server/logger');
jest.mock('@/get-config');
jest.mock('@/generate-links');
jest.mock('@/write-file');
jest.mock('@/utils');

const mockedLogger = jest.mocked(Logger);
const mockedGetConfig = jest.mocked(getConfig);
const mockedGenerateLinks = jest.mocked(generateLinks);
const mockedWriteFile = jest.mocked(writeFile);
const mockedGetRunTimeInSeconds = jest.mocked(getRunTimeInSeconds);

const contentName = ['some-content', 'some-name'];
const links = [
    { key: 'link1a', value: 'link1b' },
    { key: 'link2a', value: 'link2b' },
];

describe('@main', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('calls functions correctly on non-dry on', async () => {
        const config = { dry: false };
        mockedGetConfig.mockImplementation(cast(() => Promise.resolve(config)));
        mockedGenerateLinks.mockImplementation(cast(() => Promise.resolve(links)));
        mockedWriteFile.mockImplementation(cast(() => Promise.resolve(contentName)));
        mockedGetRunTimeInSeconds.mockImplementation(() => 'test');
        const args = ['some', 'args'];
        const content = await main(args);
        expect(mockedGetConfig).toHaveBeenCalledWith(args);
        expect(mockedGenerateLinks).toHaveBeenCalledWith(config);
        expect(mockedWriteFile).toHaveBeenCalledWith(links, config);
        expect(mockedLogger.success).toHaveBeenCalledWith(
            'generated 2 nextjs links in test seconds here: some-name'
        );
        expect(content).toEqual('some-content');
    });

    test('calls functions correctly on dry on', async () => {
        const config = { dry: true };
        mockedGetConfig.mockImplementation(cast(() => Promise.resolve(config)));
        mockedGenerateLinks.mockImplementation(cast(() => Promise.resolve(links)));
        mockedWriteFile.mockImplementation(cast(() => Promise.resolve(contentName)));
        mockedGetRunTimeInSeconds.mockImplementation(() => 'test');
        const args = ['some', 'args'];
        const content = await main(args);
        expect(mockedGetConfig).toHaveBeenCalledWith(args);
        expect(mockedGenerateLinks).toHaveBeenCalledWith(config);
        expect(mockedWriteFile).toHaveBeenCalledWith(links, config);
        expect(mockedLogger.log).toHaveBeenCalledWith(
            LogLevel.More,
            LogSeverity.None,
            'some-content'
        );
        expect(mockedLogger.success).toHaveBeenCalledWith(
            'dry run generated 2 nextjs links in test seconds'
        );
        expect(content).toEqual('some-content');
    });
});
