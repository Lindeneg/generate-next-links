import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import walk from '@/walk';
import Link from '@/link';
import RootLink from '@/link/root-link';
import { getRegex, handleEntry } from './utils';
import type { IConfig } from '@/types';

export default async ({
    api,
    path,
    nativeSeparator,
    convertCamelCase,
    convertHyphens,
    base,
    root,
}: IConfig): Promise<Link[]> => {
    const config = { convertCamelCase, convertHyphens, base };
    const links: Link[] = [];
    if (root) {
        const rootLink = new RootLink(config);
        Logger.log(LogLevel.More, LogSeverity.None, `generated link ${rootLink}`);
        links.push(rootLink);
    }
    const regex = getRegex(api);
    const filePaths = await walk(api, path, nativeSeparator);
    const boundHandleEntry = handleEntry.bind(null, {
        regex,
        links,
        separator: nativeSeparator,
        config,
    });
    const promises: Array<ReturnType<typeof handleEntry>> = filePaths.map((filePath) =>
        boundHandleEntry(filePath)
    );
    await Promise.all(promises);
    return links;
};
