import { exit } from 'process';

export const tryOrFallback = async <T, F>(
    callback: () => Promise<T>,
    fallback: (err: unknown) => F
): Promise<T | F> => {
    try {
        return callback();
    } catch (err) {
        return fallback(err);
    }
};

export const tryOrNull = async <T>(
    callback: () => Promise<T>
): Promise<T | null> => {
    return tryOrFallback(callback, () => null);
};

export const tryOrExit = async <T>(
    callback: () => Promise<T>
): Promise<T> => {
    return tryOrFallback(callback, (err) => {
        console.log(err);
        exit(1);
    });
};

export const removeTargetExtension = (target: string): string => {
    return target.replace(/\.(tsx|jsx|ts|js)/, '');
};

export const getLastInArray = <T>(arr: T[]): T | null => {
    const last = arr[arr.length - 1];
    if (typeof last !== 'undefined') {
        return last;
    }
    return null;
};