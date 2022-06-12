import { exit } from 'process';
import Logger from '@cl-live-server/logger';
import { tryOrExit, tryOrFallback, tryOrNull } from '.';

jest.mock('@cl-live-server/logger');
jest.mock('process', () => ({
    exit: jest.fn(),
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedExit = jest.mocked(exit);

describe('@utils/try', () => {
    const err = new Error('test-error');
    let errCallback: () => Promise<void>;
    let successCallback: () => Promise<string>;
    beforeEach(() => {
        jest.resetAllMocks();
        errCallback = jest.fn(async () => {
            throw err;
        });
        successCallback = jest.fn(() => Promise.resolve('success'));
    });
    describe('tryOrExit', () => {
        test('calls exit and does not log error if no opts', async () => {
            await tryOrExit(errCallback);
            expect(errCallback).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(1);
            expect(mockedLogger.error).toHaveBeenCalledTimes(0);
        });
        test('calls exit and does log error if opts', async () => {
            await tryOrExit(errCallback, true);
            expect(errCallback).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(1);
            expect(mockedLogger.error).toHaveBeenCalledTimes(1);
            expect(mockedLogger.error).toHaveBeenCalledWith(err);
        });
        test('returns callback result if no err', async () => {
            const result = await tryOrExit(successCallback);
            expect(result).toEqual('success');
            expect(successCallback).toHaveBeenCalledTimes(1);
            expect(errCallback).toHaveBeenCalledTimes(0);
            expect(mockedExit).toHaveBeenCalledTimes(0);
            expect(mockedLogger.error).toHaveBeenCalledTimes(0);
        });
    });
    describe('tryOrNull', () => {
        test('returns null on err', async () => {
            const result = await tryOrNull(errCallback);
            expect(result).toEqual(null);
        });
        test('returns callback result on non-err', async () => {
            const result = await tryOrNull(successCallback);
            expect(result).toEqual('success');
        });
    });
    describe('tryOrFallback', () => {
        test('calls and returns fallback on err', async () => {
            const result = await tryOrFallback(errCallback, successCallback);
            expect(errCallback).toHaveBeenCalledTimes(1);
            expect(successCallback).toHaveBeenCalledTimes(1);
            expect(result).toEqual('success');
        });
        test('returns callback result on non-err', async () => {
            const result = await tryOrFallback(successCallback, errCallback);
            expect(errCallback).toHaveBeenCalledTimes(0);
            expect(successCallback).toHaveBeenCalledTimes(1);
            expect(result).toEqual('success');
        });
    });
});
