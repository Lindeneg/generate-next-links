import { unlink, readFile } from 'fs/promises';
import {
    tsApiSnapshot,
    tsNonApiSnapshot,
    jsonApiSnapshot,
    jsonNonApiSnapshot,
} from '../__mock__/snapshots';
import main from '@/main';
import path from 'path';

const remove = async (name: string): Promise<ReturnType<typeof unlink> | null> => {
    try {
        return unlink(path.join('.', '__mock__', name));
    } catch (err) {
        return null;
    }
};

const read = async (name: string): Promise<ReturnType<typeof readFile> | null> => {
    try {
        return readFile(path.join('.', '__mock__', name));
    } catch (err) {
        return null;
    }
};

describe('@generate-next-links', () => {
    let file: string | null = null;

    beforeEach(() => {
        file = null;
    });

    afterEach(async () => {
        file && (await remove(file));
    });

    test.each([
        ['ts', 'without', tsNonApiSnapshot],
        ['ts', 'with', tsApiSnapshot],
        ['json', 'without', jsonNonApiSnapshot],
        ['json', 'with', jsonApiSnapshot],
    ])('can generate %s file with pages links %s api', async (ext, mode, snapshot) => {
        const api = mode === 'with';
        const name = mode + 'links';
        const ename = name + '.' + ext;
        file = ename;

        await main([
            '-P',
            './__mock__',
            '-O',
            './__mock__',
            '-N',
            name,
            '-T',
            '-Q',
            '-C',
            '-E',
            api ? '-A' : '',
            ext === 'json' ? '-J' : '',
        ]);

        const content = await read(ename);

        expect(content?.toString()).toMatchInlineSnapshot(snapshot);
    });
});
