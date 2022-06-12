/* istanbul ignore file */
import Link from '@/link';
import type { TLinkOptions } from '@/link/types';
import type { TRegex } from '@/types';

export type TGenerateLinkRegex = TRegex<'ext' | 'file'>;

export type HandleEntryOptions = {
    config: TLinkOptions;
    separator: string;
    regex: TGenerateLinkRegex;
    links: Link[];
};
