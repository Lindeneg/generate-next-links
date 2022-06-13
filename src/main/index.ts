import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import getConfig from '@/get-config';
import generateLinks from '@/generate-links';
import writeFile from '@/write-file';
import { getRunTimeInSeconds } from '@/utils';

export default async (args: string[]): Promise<string> => {
    const config = await getConfig(args);
    const links = await generateLinks(config);
    const [content, name] = await writeFile(links, config);
    if (config.dry) {
        Logger.log(LogLevel.More, LogSeverity.None, content);
        Logger.success(`dry run generated ${links.length} links in ${getRunTimeInSeconds(config.start)} seconds`);
    } else {
        Logger.success(
            `generated ${links.length} nextjs links in ${getRunTimeInSeconds(config.start)} seconds here: ${name}`
        );
    }
    Logger.log(LogLevel.Less, LogSeverity.None, '');
    return content;
};
