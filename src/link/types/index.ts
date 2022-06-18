/* istanbul ignore file */
import type { IConfig } from '@/types';

export type TLinkOptions = Partial<Pick<IConfig, 'convertCamelCase' | 'convertHyphens'>> &
    Pick<IConfig, 'base'>;
