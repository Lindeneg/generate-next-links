import Logger from '@cl-live-server/logger';
import walk from '@/walk';
import * as utils from '@/walk/utils';

jest.mock('@cl-live-server/logger');
jest.mock('@/walk/utils');

const mockedLogger = jest.mocked(Logger);
const mockedUtil = jest.mocked(utils);

describe('@walk', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('can call findPotentialFiles with correct arguments and get array in return', async () => {
        const args: [boolean, string, string] = [true, 'some-path', '/'];
        const mockPaths = ['hello', 'there'];
        mockedUtil.findPotentialFiles.mockImplementation(async () => mockPaths);
        const paths = await walk(...args);

        expect(mockedUtil.findPotentialFiles).toHaveBeenCalledTimes(1);
        expect(mockedUtil.findPotentialFiles).toHaveBeenCalledWith(...args);
        expect(mockedLogger.debug).toHaveBeenCalledTimes(1);
        expect(mockedLogger.debug).toHaveBeenCalledWith('found potential file paths', mockPaths);
        expect(paths).toEqual(mockPaths);
    });
});
