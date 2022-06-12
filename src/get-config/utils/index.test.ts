import { lstat } from 'fs/promises';
import path from 'path';
import process, { exit, platform } from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import { isDirectory, getNativeSeparator, parseNextArgs, setPagesPath, checkPagesPath, getDefaultConfig } from '.';

const cast = <T>(arg: unknown): T => {
    return <T>arg;
};

jest.mock('@cl-live-server/logger');
jest.mock('fs/promises');
jest.mock('process', () => ({
    platform: '',
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
        test.each([[true], [false]])('can return lstat result if no error is thrown', async (expected) => {
            mockedLstat.mockImplementation(async () => {
                return cast({
                    isDirectory: () => expected,
                });
            });
            const result = await isDirectory('./found-dir');
            expect(result).toBe(expected);
            expect(mockedLogger.log).toHaveBeenCalledTimes(0);
        });
        test('can catch error and log it correctly', async () => {
            const testError = new Error('test-error');
            mockedLstat.mockImplementation(async () => {
                throw testError;
            });
            const result = await isDirectory('./not-found-dir');
            expect(result).toBe(false);
            expect(mockedLogger.log).toHaveBeenCalledWith(LogLevel.More, LogSeverity.Error, testError);
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

    describe('parseNextArgs', () => {
        test.each([
            ['--name', '-N', 'name', 'AppLink', 'AppLink', {}],
            ['--path', '-P', 'path', './some/out/path', path.join('root', 'some', 'out', 'path'), { path: './root' }],
            ['--out', '-O', 'out', './some/out/path', path.join('root', 'some', 'out', 'path'), { out: './root' }],
            ['--base', '-B', 'base', '/some-base', path.join('/', 'some-base'), {}],
            ['--tab-size', '-S', 'tabWidth', '2', 2, {}],
        ])('can handle next arg %s | %s', (arg1, arg2, key, next, expected, overrides) => {
            const config1 = { ...overrides };
            const config2 = { ...overrides };
            parseNextArgs(next, arg1, cast(config1));
            parseNextArgs(next, arg2, cast(config2));
            expect(config1).toEqual({ [key]: expected });
            expect(config2).toEqual({ [key]: expected });
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
        });
    });

    //describe('setPagesPath', () => {});

    //describe('checkPagesPath', () => {});

    //describe('getDefaultConfig', () => {});
});
