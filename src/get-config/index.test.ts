import { exit } from 'process';
import Logger, { LogLevel } from '@cl-live-server/logger';
import { cast } from '@/utils';
import getConfig from '@/get-config';
import * as utils from '@/get-config/utils';
import { HELP, VERSION } from '@/get-config/static';

jest.mock('@cl-live-server/logger');
jest.mock('@/get-config/utils');
jest.mock('process', () => ({
    exit: jest.fn(),
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedUtils = jest.mocked(utils);
const mockedExit = jest.mocked(exit);

describe('@get-config', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe('parseNextArgs', () => {
        test('calls correctly with shorthands', async () => {
            await getConfig(['-O', '-P', '-N', '-B', '-S']);
            expect(mockedUtils.parseNextArgs).toHaveBeenCalledTimes(5);
        });
        test('calls correctly with full name', async () => {
            await getConfig(['--out', '--path', '--name', '--base', '--tab-size']);
            expect(mockedUtils.parseNextArgs).toHaveBeenCalledTimes(5);
        });
        test('ignores invalid flags', async () => {
            await getConfig(['--version', '-A']);
            expect(mockedUtils.parseNextArgs).toHaveBeenCalledTimes(0);
        });
    });

    describe('flags', () => {
        test.each([['-V'], ['--verbose']])('%s sets highest LogLevel', async (flag) => {
            mockedUtils.getDefaultConfig.mockImplementation(cast(() => ({})));
            mockedLogger.logLevel = LogLevel.Middle;
            const config = await getConfig([flag]);
            expect(mockedLogger.logLevel).toEqual(LogLevel.Verbose);
            expect(config.verbose).toBe(true);
        });
        test.each([
            ['-I', 'version'],
            ['--version', 'version'],
            ['-H', 'help'],
            ['--help', 'help'],
        ])('%s prints %s and exits', async (flag, mode) => {
            await getConfig([flag]);
            expect(mockedLogger.print).toHaveBeenCalledTimes(1);
            expect(mockedLogger.print).toHaveBeenCalledWith(
                mode === 'version' ? `version: ${VERSION}` : HELP
            );
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(0);
        });
    });

    describe('prints and returns correct config', () => {
        const expected = {
            api: true,
            convertCamelCase: true,
            convertHyphens: true,
            dry: true,
            exportJson: true,
            omitTimestamp: true,
            singleQuotes: true,
            root: true,
        };
        test.each([
            [
                'full name',
                [
                    '--dry',
                    '--single-quote',
                    '--api',
                    '--root',
                    '--omit-timestamp',
                    '--convert-camel-case',
                    '--convert-hyphens',
                    '--export-json',
                ],
            ],
            ['shorthands', ['', '-D', '-Q', '-A', '-R', '-T', '-C', '-E', '-J']],
        ])('using %s', async (_, args) => {
            mockedUtils.getDefaultConfig.mockImplementation(cast(() => ({})));
            const config = await getConfig(args);
            expect(mockedUtils.setPagesPath).toHaveBeenCalledTimes(1);
            expect(mockedLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockedLogger.debug).toHaveBeenCalledWith('parsed config: ', config);
            expect(mockedUtils.checkPagesPath).toHaveBeenCalledTimes(1);
            expect(config).toEqual(expected);
        });
    });
});
