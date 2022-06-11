export type TRegex<K extends string> = Record<K, RegExp>;

export type TConfig = {
    path: string;
    out: string;
    name: string;
    base: string;
    nativeSeparator: string;
    dry: boolean;
    api: boolean;
    root: boolean;
    verbose: boolean;
    omitTimestamp: boolean;
    exportJson: boolean;
    convertCamelCase: boolean;
    start: number;
};
