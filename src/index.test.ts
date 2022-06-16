import { unlink, readFile } from 'fs/promises';
import {
    tsApiSnapshot,
    tsNonApiSnapshot,
    tsRootBaseSnapshot,
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
        ['ts', [], tsNonApiSnapshot, 'a'],
        ['ts', ['-A'], tsApiSnapshot, 'b'],
        ['ts', ['-R', '-B', '/some/base'], tsRootBaseSnapshot, 'e'],
        ['json', ['-J'], jsonNonApiSnapshot, 'c'],
        ['json', ['-J', '-A'], jsonApiSnapshot, 'd'],
    ])('can generate %s file with pages links with %s', async (ext, overrides, snapshot, id) => {
        const name = id + 'links';
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
            ...overrides,
        ]);

        const content = await read(ename);

        expect(content?.toString()).toMatchInlineSnapshot(snapshot);
    });
});
