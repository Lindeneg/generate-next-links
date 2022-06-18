import { regex } from '@/link/static';
import type { TLinkOptions } from '@/link/types';
import {
    removeTargetExtension,
    getLastInArray,
    convertCamelCase,
    convertHyphens,
    prefixStringIfNumber,
} from '@/utils';

export default class Link {
    public value: string;
    public key: string;

    private readonly options: TLinkOptions;
    protected readonly strippedBase: string;

    constructor(entries: string[], options: TLinkOptions) {
        this.options = { convertCamelCase: false, convertHyphens: false, ...options };
        this.strippedBase = '/' + this.stripForwardSlash(this.options.base);
        [this.key, this.value] = this.generateLink(entries);
    }

    public toString() {
        return JSON.stringify(
            {
                name: this.key,
                link: this.value,
            },
            null,
            4
        );
    }

    private getNameWithoutExtension(entries: string[]): string {
        const last = getLastInArray(entries);
        if (last !== null) {
            return removeTargetExtension(last);
        }
        return '';
    }

    private generateLink(entries: string[]): [string, string] {
        const value = this.getInitialLink(entries);
        const notSeparator = regex.notSeparator.test(value);
        const key = this.runConversions(value).replace(regex.separator, (e) => {
            //@ts-expect-error asd
            const isOpt = e.match(regex.opt).length === 4;
            const label = regex.label.exec(e);
            const prefix = (notSeparator ? '' : '_') + (isOpt ? 'optional_catchall_' : 'catchall_');
            //@ts-expect-error asd
            return prefix + String(label[1]);
        });

        return [this.runClean(key), value];
    }

    private runConversions(target: string): string {
        if (this.options.convertCamelCase) {
            target = convertCamelCase(target);
        }
        if (this.options.convertHyphens) {
            target = convertHyphens(target);
        }
        return target;
    }

    private runClean(target: string): string {
        let result = '';
        for (let i = 0; i < target.length; i++) {
            const entry = target[i];
            if (entry === '/' && i > 0) {
                result += '_';
            } else if ((entry === '/' && i === 0) || ['[', ']', ' ', '-'].includes(entry)) {
                result += '';
            } else {
                result += entry.toUpperCase();
            }
        }
        return prefixStringIfNumber(result);
    }

    private getInitialLink(entries: string[]): string {
        const name = this.getNameWithoutExtension(entries);
        const copy = [...entries];
        copy.pop();
        const value = copy.join('/') + '/' + (name === 'index' ? '' : name);
        return this.appendToBase(value);
    }

    private stripForwardSlash(target: string): string {
        if (target.startsWith('/')) {
            target = target.slice(1);
        }
        if (target.endsWith('/')) {
            target = target.slice(0, target.length - 1);
        }
        return target;
    }

    protected appendToBase(value: string): string {
        const strippedValue = this.stripForwardSlash(value);
        return (
            this.strippedBase + (this.strippedBase === '/' ? strippedValue : '/' + strippedValue)
        );
    }
}
