import { removeTargetExtension, getLastInArray } from '../utils';

const regex = {
    separator: /\/(\[){1,2}\.{3}[a-zA-Z]+(\]){1,2}/,
    camelCase: /(?=[A-Z])/,
    opt: /(\[)|(\])/g,
    label: /\.{3}([a-zA-Z]+)/,
};

export default class Link {
    public readonly value: string;
    public readonly key: string;
    public readonly nameWithoutExt: string;

    private readonly catchAll: boolean;
    private readonly optionalCatchAll: boolean;

    constructor(entries: string[]) {
        [this.catchAll, this.optionalCatchAll] = this.getCatchAlls(entries);
        this.nameWithoutExt = this.getNameWithoutExtension(entries);
        this.key = this.generateKey(entries);
        this.value = this.generateValue(entries);
    }

    private getNameWithoutExtension(entries: string[]): string {
        const last = getLastInArray(entries);
        if (last !== null) {
            return removeTargetExtension(last);
        }
        return '';
    }

    private replaceLastWithCleanedName = (entries: string[]): string => {
        const copy = [...entries];
        copy.pop();
        let value = copy.join('/') + '/' + this.nameWithoutExt;
        if (!value.startsWith('/')) {
            value = '/' + value;
        }
        return value;
    };

    private getCatchAlls(entries: string[]): [boolean, boolean] {
        const target = entries.join('/');
        const isOpt = target.match(regex.opt)?.length === 4;
        const label = regex.label.exec(target);
        console.log(target, isOpt, label);
        if (label && label.length > 1) {
        }
        return [false, false];
    }

    private generateKey(entries: string[]): string {
        const key: string = entries.join('/');

        if (this.optionalCatchAll) {
        } else if (this.catchAll) {
        }

        return key.toUpperCase();
    }

    private generateValue(entries: string[]): string {
        return this.replaceLastWithCleanedName(entries);
    }
}
