import { format } from 'prettier';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import writeFile from '@/write-file';
import * as utils from '@/write-file/utils';
import { cast } from '@/utils';

jest.mock('@cl-live-server/logger');
jest.mock('prettier');
jest.mock('@/write-file/utils');

const mockedLogger = jest.mocked(Logger, true);
const mockedUtils = jest.mocked(utils);
const mockedFormat = jest.mocked(format);

const getConfig = (overrides = {}): Record<string, unknown> => ({
    exportJson: false,
    tabWidth: 4,
    singleQuotes: false,
    ...overrides,
});

describe('@write-file', () => {
    const links = ['hello', 'there'];
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('calls getName with given config', async () => {
        mockedUtils.getName.mockImplementation(() => 'test-name');
        const config = getConfig();
        await writeFile(cast(links), cast(config));
        expect(mockedUtils.getName).toHaveBeenCalledTimes(1);
        expect(mockedUtils.getName).toHaveBeenCalledWith(config);
    });
    test('calls getContent with given links, config', async () => {
        mockedUtils.getName.mockImplementation(() => 'test-name');
        mockedUtils.getContent.mockImplementation(() => 'test-content');
        const config = getConfig();
        await writeFile(cast(links), cast(config));
        expect(mockedUtils.getContent).toHaveBeenCalledTimes(1);
        expect(mockedUtils.getContent).toHaveBeenCalledWith(links, config);
    });
    test.each([
        ['typescript', getConfig()],
        ['json', getConfig({ exportJson: true })],
    ])('calls format with return value from getContent using %s', async (parser, config) => {
        mockedUtils.getName.mockImplementation(() => 'test-name');
        mockedUtils.getContent.mockImplementation(() => 'test-content');
        mockedFormat.mockImplementation(() => 'formatted-test-content');
        await writeFile(cast(links), cast(config));
        expect(mockedFormat).toHaveBeenCalledTimes(1);
        expect(mockedFormat).toHaveBeenCalledWith('test-content', {
            parser,
            tabWidth: 4,
            singleQuote: false,
        });
        expect(mockedLogger.debug).toHaveBeenCalledTimes(1);
        expect(mockedLogger.debug).toHaveBeenCalledWith('creating file: test-name');
        expect(mockedUtils.writeFile).toHaveBeenCalledTimes(1);
        expect(mockedUtils.writeFile).toHaveBeenCalledWith('test-name', 'formatted-test-content');
    });
    test('logs dry run info if dry run is chosen', async () => {
        mockedUtils.getName.mockImplementation(() => 'test-name');
        mockedUtils.getContent.mockImplementation(() => 'test-content');
        mockedFormat.mockImplementation(() => 'formatted-test-content');
        const result = await writeFile(cast(links), cast(getConfig({ dry: true })));
        expect(mockedLogger.log).toHaveBeenCalledTimes(1);
        expect(mockedLogger.log).toHaveBeenCalledWith(
            LogLevel.More,
            LogSeverity.Warning,
            'dry run chosen, no files committed'
        );
        expect(result).toEqual(['formatted-test-content', 'test-name']);
    });
});
