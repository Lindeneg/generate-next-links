import { lstat } from 'fs/promises';
import path from 'path';
import process, { exit, platform } from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import {
    isDirectory,
    getNativeSeparator,
    getPrefixSeparator,
    parseNextArgs,
    setPagesPath,
    checkPagesPath,
    parseTabSizeNumber,
    getDefaultConfig,
} from '@/get-config/utils';
import { HELP } from '@/get-config/static';
import { cast } from '@/utils';

jest.mock('@cl-live-server/logger');
jest.mock('fs/promises');
jest.mock('process', () => ({
    platform: 'test-platform',
    exit: jest.fn(),
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedLstat = jest.mocked(lstat);
const mockedExit = jest.mocked(exit);

describe('@get-config/utils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('isDirectory', () => {
        test.each([[true], [false]])(
            'can return lstat result if no error is thrown',
            async (expected) => {
                mockedLstat.mockImplementation(async () => {
                    return cast({
                        isDirectory: () => expected,
                    });
                });
                const result = await isDirectory('./found-dir');
                expect(result).toBe(expected);
                expect(mockedLogger.log).toHaveBeenCalledTimes(0);
            }
        );
        test('can catch error and log it correctly', async () => {
            const testError = new Error('test-error');
            mockedLstat.mockImplementation(async () => {
                throw testError;
            });
            const result = await isDirectory('./not-found-dir');
            expect(result).toBe(false);
            expect(mockedLogger.log).toHaveBeenCalledWith(
                LogLevel.More,
                LogSeverity.Error,
                testError
            );
        });
    });

    describe('getNativeSeparator', () => {
        test.each([
            ['linux', '/'],
            ['win32', '\\'],
        ])('can return correct separator from platform %s', (_platform, expected) => {
            const originalPlatform = platform;
            Object.defineProperty(process, 'platform', {
                value: _platform,
            });
            const result = getNativeSeparator();
            expect(result).toBe(expected);

            Object.defineProperty(process, 'platform', {
                value: originalPlatform,
            });
        });
    });

    describe('getPrefixSeparator', () => {
        test.each([
            [true, '\\', '/'],
            [false, '\\', '\\'],
        ])('can return correct prefix separator', (isBase, native, expected) => {
            expect(getPrefixSeparator(isBase, native)).toEqual(expected);
        });
    });

    describe('parseNextArgs', () => {
        const sep = platform === 'win32' ? '\\' : '/';
        test.each([
            ['--name', '-N', 'name', 'AppLink', 'AppLink', {}],
            ['--name', '-N', 'name', 'App Link', 'AppLink', {}],
            ['--name', '-N', 'name', '123 App%Link-123', 'N123AppLink123', {}],
            [
                '--path',
                '-P',
                'path',
                './some/out/path',
                path.join('root', 'some', 'out', 'path'),
                { path: './root', nativeSeparator: sep },
            ],
            [
                '--out',
                '-O',
                'out',
                './some/out/path',
                path.join('root', 'some', 'out', 'path'),
                { out: './root', nativeSeparator: sep },
            ],
            ['--base', '-B', 'base', '/some-base', '/some-base', { nativeSeparator: sep }],
            ['--tab-size', '-S', 'tabWidth', '2', 2, {}],
        ])('can handle next arg %s | %s', (arg1, arg2, key, next, expected, overrides) => {
            const config1 = { ...overrides };
            const config2 = { ...overrides };
            parseNextArgs(next, arg1, cast(config1));
            parseNextArgs(next, arg2, cast(config2));
            expect(config1).toEqual({ ...overrides, [key]: expected });
            expect(config2).toEqual({ ...overrides, [key]: expected });
            expect(mockedLogger.error).toHaveBeenCalledTimes(0);
        });
        test('logs and exits if flag specified without required arg', () => {
            const config = {};
            parseNextArgs(undefined, '--path', cast(config));
            expect(mockedLogger.error).toHaveBeenCalledWith(
                // eslint-disable-next-line quotes
                "a flag '--path' that requires an argument was passed without an argument"
            );
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(1);
        });
    });

    describe('setPagesPath', () => {
        test.each([
            ['./root', '/'],
            ['./root/pages', '/'],
            ['./root/pages/', '/'],
        ])('can set path from: %s', (pagesPath, nativeSeparator) => {
            const expected = path.join('/', 'root', 'pages');
            const config = {
                nativeSeparator,
                path: pagesPath,
            };
            setPagesPath(cast(config));
            expect(config.path).toEqual(expected);
        });
    });

    describe('parseTabSizeNumber', () => {
        test.each([
            ['2', 0, 2],
            ['asd', 1, undefined],
        ])('can set path from: %s', (target, err, expected) => {
            const result = parseTabSizeNumber(target);
            expect(result).toEqual(expected);
            expect(mockedExit).toHaveBeenCalledTimes(err);
            expect(mockedLogger.error).toHaveBeenCalledTimes(err);
            if (err) {
                expect(mockedLogger.error).toHaveBeenCalledWith(
                    // eslint-disable-next-line quotes
                    "flag '--tab-size' '-S' requires integer argument, not 'asd'"
                );
            }
        });
    });

    describe('checkPagesPath', () => {
        test('exits if pages is not directory', async () => {
            mockedLstat.mockImplementation(async () => {
                return cast({
                    isDirectory: () => false,
                });
            });
            await checkPagesPath(cast({ path: './some-path' }));
            expect(mockedLogger.error).toHaveBeenCalledWith('`pages` folder not found.. exiting..');
            expect(mockedLogger.print).toHaveBeenCalledWith(HELP, LogSeverity.None);
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(1);
        });

        test('does not exist if pages is directory', async () => {
            mockedLstat.mockImplementation(async () => {
                return cast({
                    isDirectory: () => true,
                });
            });
            await checkPagesPath(cast({ path: './some-path' }));
            expect(mockedLogger.error).toHaveBeenCalledTimes(0);
            expect(mockedLogger.print).toHaveBeenCalledTimes(0);
            expect(mockedExit).toHaveBeenCalledTimes(0);
        });
    });

    describe('getDefaultConfig', () => {
        test('can get config', () => {
            const root = './root';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { start, ...config } = getDefaultConfig(root);
            expect(config).toEqual({
                path: root,
                out: root,
                nativeSeparator: '/',
                tabWidth: 4,
                name: 'links',
                base: '/',
                dry: false,
                api: false,
                root: false,
                verbose: false,
                omitTimestamp: false,
                exportJson: false,
                singleQuotes: false,
                convertCamelCase: false,
                convertHyphens: false,
            });
        });
    });
});
