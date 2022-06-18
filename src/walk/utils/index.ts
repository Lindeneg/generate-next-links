import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { tryOrExit, tryOrNull } from '@/utils';
import type { TWalkRegex } from '@/walk/types';

export const getRegex = (api: boolean, separator: string): TWalkRegex => ({
    file: api
        ? new RegExp(`^(.+.(tsx|jsx)|.*\\${separator}api\\${separator}.+.(ts|js))$`)
        : /^.+\.(tsx|jsx)$/,
    pages: new RegExp(`.+\\${separator}pages\\${separator}`),
});

export const targetFilePathCallback = async (
    api: boolean,
    targetPath: string,
    separator: string,
    regex: TWalkRegex,
    filePath: string,
    results: string[],
    promises: Promise<void | string[]>[]
) => {
    const resolvedFilePath = resolve(targetPath, filePath);
    const fileStat = await tryOrNull(() => stat(resolvedFilePath));
    if (fileStat && fileStat.isDirectory()) {
        return findPotentialFiles(api, resolvedFilePath, separator, results, promises);
    }
    if (regex.file.test(resolvedFilePath)) {
        const cleanedFilePath = resolvedFilePath.replace(regex.pages, '');
        results.push(cleanedFilePath);
    }
    return Promise.resolve();
};

export const findPotentialFiles = async (
    api: boolean,
    targetPath: string,
    separator: string,
    results: string[] = [],
    promises: Promise<void | string[]>[] = []
): Promise<string[]> => {
    const regex = getRegex(api, separator);
    const targetFilePaths = await tryOrExit(() => readdir(targetPath));
    promises = targetFilePaths.map((filePath) =>
        targetFilePathCallback(api, targetPath, separator, regex, filePath, results, promises)
    );
    await Promise.all(promises);
    return results;
};
