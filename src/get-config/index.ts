import { exit } from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import { checkPagesPath, getDefaultConfig, parseNextArgs, setPagesPath } from '@/get-config/utils';
import { HELP, VERSION } from '@/get-config/static';
import type { IConfig } from '@/types';

export default async (args: string[]): Promise<IConfig> => {
    const root = process.cwd();
    const config: IConfig = getDefaultConfig(root);
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--out':
            case '-O':
            case '--path':
            case '-P':
            case '--name':
            case '-N':
            case '--base':
            case '-B':
            case '--tab-size':
            case '-S':
                parseNextArgs(args[i + 1], arg, config);
                break;
            case '--version':
            case '-I':
                Logger.print(`version: ${VERSION}`, LogSeverity.None);
                return exit(0);
            case '--dry':
            case '-D':
                config.dry = true;
                break;
            case '--verbose':
            case '-V':
                Logger.logLevel = LogLevel.Verbose;
                config.verbose = true;
                break;
            case '--api':
            case '-A':
                config.api = true;
                break;
            case '--single-quote':
            case '-Q':
                config.singleQuotes = true;
                break;
            case '--root':
            case '-R':
                config.root = true;
                break;
            case '--omit-timestamp':
            case '-T':
                config.omitTimestamp = true;
                break;
            case '--convert-camel-case':
            case '-C':
                config.convertCamelCase = true;
                break;
            case '--convert-hyphens':
            case '-E':
                config.convertHyphens = true;
                break;
            case '--export-json':
            case '-J':
                config.exportJson = true;
                break;
            case '--help':
            case '-H':
                Logger.print(HELP, LogSeverity.None);
                return exit(0);
            default:
                break;
        }
    }
    setPagesPath(config);
    Logger.debug('parsed config: ', config);
    await checkPagesPath(config);
    return config;
};
