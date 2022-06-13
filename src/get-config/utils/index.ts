import { lstat } from 'fs/promises';
import { exit, platform } from 'process';
import { join as joinPath } from 'path';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import { HELP } from '@/get-config/static';
import { prefixStringIfNotContainedInStart } from '@/utils/string';
import type { IConfig } from '@/types';

export const isDirectory = async (target: string): Promise<boolean> => {
    try {
        const stat = await lstat(target);
        return stat.isDirectory();
    } catch (err) {
        Logger.log(LogLevel.More, LogSeverity.Error, err);
    }
    return false;
};

export const getNativeSeparator = () => (platform === 'win32' ? '\\' : '/');

export const getPrefixSeparator = (isBase: boolean, native: string): string =>
    isBase ? '/' : native;

export const parseNextArgs = (next: string | undefined, arg: string, config: IConfig): void => {
    if (next) {
        const isName = ['--name', '-N'].includes(arg);
        const isTab = ['--tab-size', '-S'].includes(arg);
        const isBase = ['--base', '-B'].includes(arg);
        const prefixedNext = prefixStringIfNotContainedInStart(
            next,
            getPrefixSeparator(isBase, config.nativeSeparator)
        );
        const target = isName || isTab ? next : prefixedNext;
        if (['--out', '-O'].includes(arg)) {
            config.out = joinPath(config.out, target);
        } else if (isName) {
            config.name = target;
        } else if (['--path', '-P'].includes(arg)) {
            config.path = joinPath(config.path, target);
        } else if (isBase) {
            config.base = target;
        } else if (isTab) {
            const n = parseInt(target);
            if (typeof n === 'number' && !Number.isNaN(n)) {
                config.tabWidth = n;
            }
        }
    } else {
        Logger.error(`a flag '${arg}' that requires an argument was passed without an argument`);
        exit(1);
    }
};

export const setPagesPath = (config: IConfig): void => {
    const splitted = config.path.split(config.nativeSeparator);
    const lastIdx = splitted.length - 1;
    if (!(splitted[lastIdx] === 'pages' || splitted[lastIdx - 1] === 'pages')) {
        config.path = joinPath(config.path, 'pages');
    } else {
        config.path = joinPath(...splitted);
    }
};

export const checkPagesPath = async (config: IConfig): Promise<void> => {
    const directory = await isDirectory(config.path);
    if (!directory) {
        Logger.error('`pages` folder not found.. exiting..');
        Logger.print(HELP);
        exit(1);
    }
};

export const getDefaultConfig = (root: string): IConfig => ({
    path: root,
    out: root,
    nativeSeparator: getNativeSeparator(),
    tabWidth: 4,
    name: 'links',
    base: '/',
    dry: false,
    api: false,
    root: false,
    verbose: false,
    omitTimestamp: false,
    exportJson: false,
    singleQuotes: false,
    convertCamelCase: false,
    convertHyphens: false,
    start: Date.now(),
});
