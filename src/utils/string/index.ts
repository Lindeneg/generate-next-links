const regex = {
    camelCase: /(?=[A-Z])/,
    hyphens: /-/g,
    ext: /\.(tsx|jsx|ts|js)/,
};

export const removeTargetExtension = (target: string): string => target.replace(regex.ext, '');

export const forEachStringEntry = (target: string, callback: (item: string, idx: number) => string) => {
    let result = '';
    for (let i = 0; i < target.length; i++) {
        result += callback(target[i], i);
    }
    return result;
};

export const convertCamelCase = (target: string): string => {
    const result: string[] = [];
    target.split(' ').forEach((entry) => {
        if (entry !== '') {
            const splitWords = entry.split(regex.camelCase).join('_');
            result.push(splitWords.charAt(0).toUpperCase() + splitWords.slice(1));
        }
    });
    return result.join(' ');
};

export const prefixStringIfNumber = (target: string, prefix = 'N'): string => {
    if (target.length > 0 && Number.isNaN(Number(target[0]))) {
        return target;
    }
    return `${prefix}${target}`;
};

export const convertHyphens = (target: string): string => target.replace(regex.hyphens, '_');
