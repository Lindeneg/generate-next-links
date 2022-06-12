import { writeFile as fsWriteFile } from 'fs/promises';
import { format } from 'prettier';
import Link from '@/link';
import type { IConfig } from '@/types';
import path from 'path';

const getContent = (links: Link[], { name, exportJson }: IConfig): string => {
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

const getName = ({ out, omitTimestamp, exportJson }: IConfig): string =>
    path.join(out, `links${omitTimestamp ? '' : '_' + Date.now()}.${exportJson ? 'json' : 'ts'}`);

const writeFile = async (name: string, content: string): Promise<void> => {
    try {
        await fsWriteFile(name, content);
    } catch (err) {}
};

export default async (links: Link[], config: IConfig): Promise<void> => {
    const name = getName(config);
    const content = format(getContent(links, config), { parser: config.exportJson ? 'json' : 'typescript' });
    // console.log: writing file: asd
    await writeFile(name, content);
};
