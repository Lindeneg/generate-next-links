import { format } from 'prettier';
import Logger from '@cl-live-server/logger';
import Link from '@/link';
import { getName, getContent, writeFile } from './utils';
import type { IConfig } from '@/types';

export default async (links: Link[], config: IConfig): Promise<[string, string]> => {
    const name = getName(config);
    const content = format(getContent(links, config), {
        parser: config.exportJson ? 'json' : 'typescript',
        tabWidth: 4,
        singleQuote: true,
    });
    Logger.debug(`creating file: ${name}`);
    await writeFile(name, content);
    return [content, name];
};
