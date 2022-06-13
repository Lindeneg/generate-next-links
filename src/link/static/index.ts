/* istanbul ignore file */
export const regex = (() => {
    const separator = /\/(\[){1,2}\.{3}[a-zA-Z]+(\]){1,2}/;
    return {
        separator,
        opt: /(\[)|(\])/g,
        label: /\.{3}([a-zA-Z]+)/,
        notSeparator: new RegExp(`^${separator.source}$`),
    };
})();
