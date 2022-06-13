import { exit } from 'process';
import { format } from 'prettier';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import Link from '@/link';
import { getName, getContent, writeFile } from '@/write-file/utils';
import type { IConfig } from '@/types';

export default async (links: Link[], config: IConfig): Promise<[string, string]> => {
    const name = getName(config);
    let content: string;
    try {
        content = format(getContent(links, config), {
            parser: config.exportJson ? 'json' : 'typescript',
            tabWidth: config.tabWidth,
            singleQuote: config.singleQuotes,
        });
    } catch (err) {
        Logger.log(LogLevel.More, LogSeverity.Error, err);
        Logger.error('Error: failed to format content');
        Logger.log(LogLevel.More, LogSeverity.Default, 'Suggestion: run with flag `-V` to debug');
        exit(1);
    }
    if (!config.dry) {
        Logger.debug(`creating file: ${name}`);
        await writeFile(name, content);
    } else {
        Logger.log(LogLevel.More, LogSeverity.Warning, 'dry run chosen, no files committed');
    }
    return [content, name];
};
