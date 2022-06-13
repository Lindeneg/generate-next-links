import { resolve } from 'path';
import { readdir, stat } from 'fs/promises';
import * as utils from '@/utils';
import { findPotentialFiles } from '@/walk/utils';
import { getNativeSeparator } from '@/get-config/utils';

jest.mock('path');
jest.mock('fs/promises');
jest.mock('@/utils');

const mockedResolve = jest.mocked(resolve);
const mockedReadDir = jest.mocked(readdir);
const mockedStat = jest.mocked(stat);
const mockedUtils = jest.mocked(utils);

describe('@walk/utils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each([['without'], ['with']])('can get files %s api', async (mode) => {
        const isWithout = mode === 'without';
        const seb = getNativeSeparator();
        const diff = 2;
        const mockPaths: string[] = [
            `${seb}api${seb}another${seb}path${seb}here.ts`,
            `${seb}some-path.jsx`,
            `${seb}some-file${seb}path.tsx`,
        ];
        const withoutApi = mockPaths.slice(1);
        let runs = 0;
        mockedReadDir.mockImplementation(async () => utils.cast(mockPaths));
        mockedUtils.tryOrExit.mockImplementation(async (e) => {
            await e();
            return mockPaths;
        });
        mockedResolve.mockImplementation((_, e) => e);
        mockedStat.mockImplementation(jest.fn());
        mockedUtils.tryOrNull.mockImplementation(async (e) => {
            await e();
            return {
                isDirectory: () => {
                    if (runs === diff) {
                        return false;
                    }
                    runs += 1;
                    return true;
                },
            };
        });
        const files = await findPotentialFiles(
            !isWithout,
            './__mock__/pages',
            getNativeSeparator()
        );
        const target = isWithout ? withoutApi : mockPaths;
        expect(runs).toEqual(diff);
        // we run 3 times in total and 2 times recursively..
        expect(files).toEqual([target[target.length - 1], ...target, ...target]);
    });
});
