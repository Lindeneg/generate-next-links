import { exit } from 'process';

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

export const tryOrExit = async <T>(callback: () => Promise<T>, logError = false): Promise<T> =>
    tryOrFallback(callback, (err) => {
        logError && console.log(err);
        exit(1);
    });
