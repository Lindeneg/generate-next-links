import { lstat } from 'fs/promises';
import process from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import { isDirectory, getNativeSeparator, parseNextArgs, setPagesPath, checkPagesPath, getDefaultConfig } from '.';

const cast = <T>(arg: unknown): T => {
    return <T>arg;
};

jest.mock('@cl-live-server/logger');
jest.mock('fs/promises');
jest.mock('process', () => ({
    platform: '',
    exit: () => null,
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedLstat = jest.mocked(lstat);
const mockedProcess = jest.mocked(process);

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
        ])('can return correct separator from platform %s', (platform, expected) => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', {
                value: platform,
            });
            const result = getNativeSeparator();
            expect(result).toBe(expected);

            Object.defineProperty(process, 'platform', {
                value: originalPlatform,
            });
        });
    });

    describe('parseNextArgs', () => {
        test.each([])('can handle next arg %s', (arg, key, expected) => {});
        test('logs and exits if flag specified without required arg', () => {});
    });

    describe('setPagesPath', () => {});

    describe('checkPagesPath', () => {});

    describe('getDefaultConfig', () => {});
});
