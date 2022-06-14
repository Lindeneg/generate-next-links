import { exit } from 'process';
import { writeFile as fsWriteFile } from 'fs/promises';
import { join as joinPath } from 'path';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import Link from '@/link';
import type { IConfig } from '@/types';

export const sortLinks = (links: Link[]): Link[] => {
    return links.sort((a, b) => (b.key > a.key ? -1 : 1));
};

export const getContent = (links: Link[], { name, exportJson }: IConfig): string => {
    if (exportJson) {
        return JSON.stringify(
            links.reduce((a, b) => {
                return {
                    ...a,
                    [b.key]: b.value,
                };
            }, {})
        );
    }
    return `
    export enum ${name} {
        ${links.map((link) => `${link.key} = "${link.value}"`)}
    };
    `;
};

export const getName = ({ out, name, omitTimestamp, exportJson }: IConfig): string =>
    joinPath(
        out,
        `${name.toLowerCase()}${omitTimestamp ? '' : '_' + Date.now()}.${
            exportJson ? 'json' : 'ts'
        }`
    );

export const writeFile = async (name: string, content: string): Promise<void> => {
    try {
        await fsWriteFile(name, content);
    } catch (err) {
        Logger.log(LogLevel.More, LogSeverity.Error, err);
        Logger.error('Error: failed to write file: ' + name);
        Logger.log(LogLevel.More, LogSeverity.Default, 'Suggestion: run with flag `-V` to debug');
        exit(1);
    }
};
