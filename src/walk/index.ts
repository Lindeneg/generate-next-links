import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { tryOrExit, tryOrNull } from '../utils';
import type { TRegex } from '../types';

type TWalkRegex = TRegex<'file' | 'pages'>;

const getRegex = (api: boolean, separator: string): TWalkRegex => ({
    file: api ? new RegExp(`^(.+.(tsx|jsx)|.+\\${separator}api\\${separator}.+.(ts|js))$`) : /^.+\.(tsx|jsx)$/,
    pages: new RegExp(`.+\\${separator}pages\\${separator}`),
});

type HandleEntryOptions = {
    api: boolean;
    separator: string;
    regex: TWalkRegex;
    targetPath: string;
    results: string[];
};

const handleEntry = async (
    { api, separator, regex, targetPath, results }: HandleEntryOptions,
    filePath: string
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
    const boundHandleEntry = handleEntry.bind(null, { api, targetPath, regex, separator, results });
    const promises: Array<ReturnType<typeof handleEntry>> = targetFilePaths.map((filePath) =>
        boundHandleEntry(filePath)
    );
    await Promise.all(promises);
    return results;
};

export default walk;
