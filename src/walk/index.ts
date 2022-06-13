import Logger from '@cl-live-server/logger';
import { findPotentialFiles } from '@/walk/utils';

export default async (api: boolean, targetPath: string, separator: string): Promise<string[]> => {
    const filePaths = await findPotentialFiles(api, targetPath, separator);
    Logger.debug('found potential file paths', filePaths);
    return filePaths;
};
