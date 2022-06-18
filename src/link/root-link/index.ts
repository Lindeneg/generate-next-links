import Link from '@/link';
import type { TLinkOptions } from '@/link/types';

export default class RootLink extends Link {
    constructor(config: TLinkOptions) {
        super([], config);
        this.key = this.key + 'ROOT';
        this.value = this.strippedBase;
    }
}
