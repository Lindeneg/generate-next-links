export const getLastInArray = <T>(arr: T[]): T | null => {
    const last = arr[arr.length - 1];
    if (typeof last !== 'undefined') {
        return last;
    }
    return null;
};
