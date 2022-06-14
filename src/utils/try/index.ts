import { exit } from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';

export const tryOrFallback = async <T, F>(
    callback: () => Promise<T>,
    fallback: (err: unknown) => Promise<F>
): Promise<T | F> => {
    let result: T | F;
    try {
        result = await callback();
    } catch (err) {
        result = await fallback(err);
    }
    return result;
};

export const tryOrNull = async <T>(callback: () => Promise<T>): Promise<T | null> =>
    tryOrFallback(callback, async () => null);

export const tryOrExit = async <T>(callback: () => Promise<T>): Promise<T> =>
    tryOrFallback(callback, (err) => {
        Logger.log(LogLevel.More, LogSeverity.Error, err);
        exit(1);
    });

export const cast = <T>(arg: unknown): T => {
    return <T>arg;
};
