import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import Link from '@/link';
import { getLastInArray } from '@/utils';
import type { HandleEntryOptions, TGenerateLinkRegex } from '@/generate-links/types';

export const getRegex = (api: boolean): TGenerateLinkRegex => ({
    ext: api ? /\.(tsx|jsx|ts|js)/g : /\.(tsx|jsx)/g,
    file: /^(_app|_document)\.(tsx|jsx)$/,
});

export const handleEntry = async (
    { config, separator, regex, links }: HandleEntryOptions,
    filePath: string
): Promise<void> => {
    const splitted = filePath.split(separator);
    const last = getLastInArray(splitted);
    //@ts-expect-error asd
    const isIndex = last.split('.')[0] === 'index';
    const hasParents = splitted.length > 1;
    if (last && !regex.file.test(last) && (!isIndex || hasParents)) {
        const link: Link = new Link(splitted, config);
        Logger.log(LogLevel.More, LogSeverity.None, `generated link ${link}`);
        links.push(link);
    } else {
        Logger.log(LogLevel.More, LogSeverity.Warning, `ignoring file: ${last}`);
    }
};
