import getConfig from '@/get-config';
import generateLinks from '@/generate-links';
import writeFile from '@/write-file';

export default async (args: string[]): Promise<void> => {
    const config = await getConfig(args);
    const links = await generateLinks(config);
    await writeFile(links, config);
};
