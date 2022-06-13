import { exit } from 'process';
import { format } from 'prettier';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import writeFile from '@/write-file';
import * as utils from '@/write-file/utils';
import { cast } from '@/utils';

jest.mock('@cl-live-server/logger');
jest.mock('prettier');
jest.mock('@/write-file/utils');
jest.mock('process', () => ({
    exit: jest.fn(),
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedExit = jest.mocked(exit);
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
    test('logs and exits if prettier.format throws', async () => {
        const err = new Error('test-error');
        mockedUtils.getName.mockImplementation(() => 'test-name');
        mockedUtils.getContent.mockImplementation(() => 'test-content');
        mockedFormat.mockImplementation(() => {
            throw err;
        });
        await writeFile(cast(links), cast(getConfig()));
        expect(mockedLogger.error).toHaveBeenCalledTimes(1);
        expect(mockedLogger.error).toHaveBeenCalledWith('Error: failed to format content');
        expect(mockedLogger.log).toHaveBeenCalledTimes(2);
        expect(mockedLogger.log).toHaveBeenNthCalledWith(1, LogLevel.More, LogSeverity.Error, err);
        expect(mockedLogger.log).toHaveBeenNthCalledWith(
            2,
            LogLevel.More,
            LogSeverity.Default,
            'Suggestion: run with flag `-V` to debug'
        );
        expect(mockedExit).toHaveBeenCalledTimes(1);
        expect(mockedExit).toHaveBeenCalledWith(1);
    });
});
