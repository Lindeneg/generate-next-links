/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
import path from 'path';
import { writeFile as fsWriteFile } from 'fs/promises';
import { exit } from 'process';
import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import Link from '@/link';
import { getContent, getName, writeFile } from '@/write-file/utils';
import { cast } from '@/utils';

jest.mock('fs/promises');
jest.mock('@cl-live-server/logger');
jest.mock('process', () => ({
    exit: jest.fn(),
}));

const mockedLogger = jest.mocked(Logger, true);
const mockedExit = jest.mocked(exit);
const mockedFsWriteFile = jest.mocked(fsWriteFile);

describe('@write-file/utils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getContent', () => {
        const links: Link[] = cast([
            { key: 'ADMIN', value: '/admin' },
            { key: 'PRODUCTS_EDIT', value: '/products/edit' },
            { key: 'POST_CATCHALL_SLUG', value: '/post/[...slug]' },
        ]);
        test('can get json content', () => {
            expect(getContent(links, cast({ name: 'name', exportJson: true }))).toEqual(
                JSON.stringify({
                    ADMIN: '/admin',
                    PRODUCTS_EDIT: '/products/edit',
                    POST_CATCHALL_SLUG: '/post/[...slug]',
                })
            );
        });

        test('can get ts content', () => {
            expect(getContent(links, cast({ name: 'AppLink', exportJson: false })).trim())
                .toMatchInlineSnapshot(`
        "export enum AppLink {
                ADMIN = \\"/admin\\",PRODUCTS_EDIT = \\"/products/edit\\",POST_CATCHALL_SLUG = \\"/post/[...slug]\\"
            };"
      `);
        });
    });

    describe('getName', () => {
        test.each([
            [
                'without',
                'without',
                { omitTimestamp: true, exportJson: false },
                path.join('.', 'root', 'applink.ts'),
            ],
            [
                'without',
                'with',
                { omitTimestamp: true, exportJson: true },
                path.join('.', 'root', 'applink.json'),
            ],
            ['with', 'with', { omitTimestamp: false, exportJson: true }, /applink_\d+\.json/],
        ])('can get name %s timestamp and %s json', (_, __, opts, expected) => {
            expect(getName(cast({ out: './root', name: 'AppLink', ...opts }))).toMatch(expected);
        });
    });

    describe('writeFile', () => {
        test('does exit if fsWriteFile throws', async () => {
            const err = new Error('test-error');
            mockedFsWriteFile.mockImplementation(async () => {
                throw err;
            });
            await writeFile('./some-path/index.ts', 'some-content');

            expect(mockedFsWriteFile).toHaveBeenCalledWith('./some-path/index.ts', 'some-content');
            expect(mockedLogger.log).toHaveBeenCalledTimes(2);
            expect(mockedLogger.log).toHaveBeenNthCalledWith(
                1,
                LogLevel.More,
                LogSeverity.Error,
                err
            );
            expect(mockedLogger.log).toHaveBeenNthCalledWith(
                2,
                LogLevel.More,
                LogSeverity.Default,
                'Suggestion: run with flag `-V` to debug'
            );
            expect(mockedLogger.error).toHaveBeenCalledTimes(1);
            expect(mockedLogger.error).toHaveBeenCalledWith(
                'Error: failed to write file: ./some-path/index.ts'
            );
            expect(mockedExit).toHaveBeenCalledTimes(1);
            expect(mockedExit).toHaveBeenCalledWith(1);
        });

        test('does not exit if fsWriteFile does not throw', async () => {
            mockedFsWriteFile.mockImplementation(() => Promise.resolve());
            await writeFile('./some-path/index.ts', 'some-content');

            expect(mockedFsWriteFile).toHaveBeenCalledWith('./some-path/index.ts', 'some-content');
            expect(mockedLogger.log).toHaveBeenCalledTimes(0);
            expect(mockedLogger.error).toHaveBeenCalledTimes(0);
            expect(mockedExit).toHaveBeenCalledTimes(0);
        });
    });
});
