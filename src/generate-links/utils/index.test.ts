import Logger, { LogLevel, LogSeverity } from '@cl-live-server/logger';
import Link from '@/link';
import { handleEntry, getRegex } from '@/generate-links/utils';

jest.mock('@cl-live-server/logger');
jest.mock('@/link');

const mockedLogger = jest.mocked(Logger, true);
const mockedLink = jest.mocked(Link, true);
const config = { base: '/' };

describe('@generate-links/utils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test.each([
        ['from valid entry', 'sir.tsx'],
        ['from index with parent', 'index.tsx'],
    ])('generates link from %s', async (_, name) => {
        const links: Link[] = [];
        await handleEntry(
            { links, regex: getRegex(false), separator: '/', config },
            `/hello/there/${name}`
        );
        expect(links.length).toEqual(1);
        expect(mockedLink).toHaveBeenCalledTimes(1);
        expect(mockedLink).toHaveBeenCalledWith(['', 'hello', 'there', name], config);
        expect(mockedLogger.log).toHaveBeenCalledTimes(1);
        expect(mockedLogger.log).toHaveBeenCalledWith(
            LogLevel.More,
            LogSeverity.None,
            `generated link ${links[0]}`
        );
    });
    test.each([
        ['app', '_app.tsx', '_app.tsx'],
        ['document', '_document.tsx', '_document.tsx'],
        ['index if no parent', 'index.tsx', 'index.tsx'],
    ])('ignores %s', async (_, filePath, match) => {
        const links: Link[] = [];
        await handleEntry({ links, regex: getRegex(true), separator: '/', config }, filePath);
        expect(links.length).toEqual(0);
        expect(mockedLink).toHaveBeenCalledTimes(0);
        expect(mockedLogger.log).toHaveBeenCalledTimes(1);
        expect(mockedLogger.log).toHaveBeenCalledWith(
            LogLevel.More,
            LogSeverity.Warning,
            `ignoring file: ${match}`
        );
    });
});
