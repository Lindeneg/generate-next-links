import walk from '@/walk';
import Link from '@/link';
import { getRegex, handleEntry } from './utils';
import type { IConfig } from '@/types';

export default async ({ api, path, nativeSeparator, convertCamelCase, convertHyphens }: IConfig): Promise<Link[]> => {
    const links: Link[] = [];
    const regex = getRegex(api);
    const filePaths = await walk(api, path, nativeSeparator);
    const boundHandleEntry = handleEntry.bind(null, {
        regex,
        links,
        separator: nativeSeparator,
        config: { convertCamelCase, convertHyphens },
    });
    const promises: Array<ReturnType<typeof handleEntry>> = filePaths.map((filePath) => boundHandleEntry(filePath));
    await Promise.all(promises);
    return links;
};
