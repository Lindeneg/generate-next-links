const regex = {
    camelCase: /(?=[A-Z])/,
    hyphens: /-/g,
    ext: /\.(tsx|jsx|ts|js)/,
};

export const removeTargetExtension = (target: string): string => target.replace(regex.ext, '');

export const convertCamelCase = (target: string): string => {
    const result: string[] = [];
    target.split(' ').forEach((entry) => {
        if (entry !== '') {
            const splitWords = entry.split(regex.camelCase).join('_');
            result.push(splitWords.charAt(0) + splitWords.slice(1));
        }
    });
    return result.join(' ');
};

export const prefixStringIfNotContainedInStart = (target: string, separator: string): string => {
    if (!target.startsWith(separator)) {
        return separator + target;
    }
    return target;
};

export const prefixStringIfNumber = (target: string, prefix?: string): string => {
    if (target.length > 0 && !Number.isNaN(parseInt(target[0]))) {
        return prefixStringIfNotContainedInStart(target, prefix || 'N');
    }
    return target;
};

export const convertHyphens = (target: string): string => target.replace(regex.hyphens, '_');

export const getRunTimeInSeconds = (start: number): string => {
    return ((Date.now() - start) / 1000).toFixed(3);
};
