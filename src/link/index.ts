import { removeTargetExtension, getLastInArray, convertCamelCase, convertHyphens, prefixStringIfNumber } from '@/utils';
import { regex } from './static';
import type { TLinkOptions } from './types';

export default class Link {
    public readonly value: string;
    public readonly key: string;

    private readonly options: TLinkOptions;

    constructor(entries: string[], options: TLinkOptions = {}) {
        this.options = { convertCamelCase: false, convertHyphens: false, ...options };
        [this.key, this.value] = this.generateLink(entries);
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
            const isOpt = (e.match(regex.opt) || []).length === 4;
            const label = regex.label.exec(e);
            if (label && label.length > 1) {
                const prefix = (notSeparator ? '' : '_') + (isOpt ? 'optional_catchall_' : 'catchall_');
                return prefix + label[1];
            }
            return e;
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
        let value = copy.join('/') + '/' + (name === 'index' ? '' : name);
        if (!value.startsWith('/')) {
            value = '/' + value;
        }
        if (value.endsWith('/')) {
            value = value.slice(0, value.length - 1);
        }
        return value;
    }
}
