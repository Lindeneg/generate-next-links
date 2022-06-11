import walk from '../walk';
import Link from '../link/';
import type { TLinkOptions } from '../link/';
import { getLastInArray } from '../utils';
import type { IConfig, TRegex } from '../types';

type TLinkRegex = TRegex<'ext' | 'file'>;

const getRegex = (api: boolean): TLinkRegex => ({
    ext: api ? /\.(tsx|jsx|ts)/g : /\.(tsx|jsx)/g,
    file: /^(_app|_document)\.(tsx|jsx)$/,
});

type HandleEntryOptions = {
    config: TLinkOptions;
    separator: string;
    regex: TLinkRegex;
    links: Link[];
};

const handleEntry = async (
    { config, separator, regex, links }: HandleEntryOptions,
    filePath: string
): Promise<void> => {
    const splitted = filePath.split(separator);
    const last = getLastInArray(splitted);
    const isIndex = last?.split('.')[0] === 'index';
    const hasParents = splitted.length > 1;
    if (last && !regex.file.test(last) && (!isIndex || hasParents)) {
        const link: Link = new Link(splitted, config);
        console.log(link.key, link.value);
        links.push(link);
    } else {
        //console.log('ignoring file', splitted);
    }
};

const generateLinks = async ({
    api,
    path,
    nativeSeparator,
    convertCamelCase,
    convertHyphens,
}: IConfig): Promise<Link[]> => {
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

//@ts-expect-error asd
generateLinks({
    api: false,
    path: './__mock__/pages',
    nativeSeparator: '\\',
    convertHyphens: true,
    convertCamelCase: true,
});

export default generateLinks;
