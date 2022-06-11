import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { tryOrExit, tryOrNull } from '../utils';
import type { TRegex } from '../types';

type TWalkRegex = TRegex<'file' | 'pages'>;

const getRegex = (api: boolean, separator: string): TWalkRegex => ({
    file: api ? new RegExp(`^(.+\.(tsx|jsx)|.+\\${separator}api\\${separator}.+\.(ts|js))$`) : /^.+\.(tsx|jsx)$/,
    pages: new RegExp(`.+\\${separator}pages\\${separator}`),
});

const handleEntry = async (
    api: boolean,
    targetPath: string,
    separator: string,
    results: string[],
    filePath: string,
    regex: TWalkRegex
): Promise<void | string[]> => {
    const resolvedFilePath = resolve(targetPath, filePath);
    const fileStat = await tryOrNull(() => stat(resolvedFilePath));
    if (fileStat && fileStat.isDirectory()) {
        return walk(api, resolvedFilePath, separator, results);
    }
    if (regex.file.test(resolvedFilePath)) {
        const cleanedFilePath = resolvedFilePath.replace(regex.pages, '');
        //console.log('pushing potential file', cleanedFilePath);
        results.push(cleanedFilePath);
    }

    return Promise.resolve();
};

const walk = async (api: boolean, targetPath: string, separator: string, results: string[] = []): Promise<string[]> => {
    const regex = getRegex(api, separator);
    const targetFilePaths = await tryOrExit(() => readdir(targetPath));
    const promises: Array<ReturnType<typeof handleEntry>> = targetFilePaths.map((filePath) =>
        handleEntry(api, targetPath, separator, results, filePath, regex)
    );
    await Promise.all(promises);
    return results;
};

export default walk;
