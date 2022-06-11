import walk from '../walk/index';
import Link from '../link/';
import { getLastInArray } from '../utils';
import type { Config } from '../config';
import type { TRegex } from '../types';

type TLinkRegex = TRegex<'ext' | 'file'>;

const getRegex = (api: boolean): TLinkRegex => ({
    ext: api ? /\.(tsx|jsx|ts)/g : /\.(tsx|jsx)/g,
    file: /^(_app|_document)\.(tsx|jsx)$/,
});

const handleEntry = async (
    regex: TLinkRegex,
    separator: string,
    links: Link[],
    filePath: string
): Promise<void> => {
    const splitted = filePath.split(separator);
    const last = getLastInArray(splitted);
    const isIndex = last?.split('.')[0] === 'index';
    const hasParents = splitted.length > 1;
    if (last && !regex.file.test(last) && (!isIndex || hasParents)) {
        const link: Link = new Link(splitted);
        //console.log(link.key, link.value);
        links.push(link);
    } else {
        //console.log('ignoring file', splitted);
    }
};

const generateLinks = async (config: Config): Promise<Link[]> => {
    const links: Link[] = [];
    const regex = getRegex(config.api);
    const filePaths = await walk(config.api, config.path, config.nativeSeparator);
    const boundHandleEntry = handleEntry.bind(
        null,
        regex,
        config.nativeSeparator,
        links
    );

    const promises: Array<ReturnType<typeof handleEntry>> = filePaths.map(
        (filePath) => boundHandleEntry(filePath)
    );

    await Promise.all(promises);

    return links;
};

//@ts-expect-error asd
generateLinks({ api: false, path: './__mock__/pages', nativeSeparator: '\\' });

export default generateLinks;
