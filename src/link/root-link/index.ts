import Link from '@/link';
import type { TLinkOptions } from '@/link/types';

export default class RootLink extends Link {
    constructor(config: TLinkOptions) {
        super([], config);
        const keySuffix = (this.key.length > 0 && !this.key.endsWith('_') ? '_' : '') + 'ROOT';
        this.key = this.key + keySuffix;
        this.value = this.strippedBase;
    }
}
