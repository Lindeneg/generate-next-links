import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import { lstat } from 'fs/promises';
import { isDirectory, getNativeSeparator, parseNextArgs, setPagesPath, checkPagesPath, getDefaultConfig } from '.';

jest.mock('@cl-live-server/logger');
jest.mock('fs/promises');

const mockedLogger = jest.mocked(Logger, true);
const mockedLstat = jest.mocked(lstat);

describe('@get-config/utils', () => {
    describe('isDirectory', () => {
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
});
