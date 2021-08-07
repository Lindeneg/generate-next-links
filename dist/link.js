"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLink = void 0;
function getLink(target) {
    var name = target.replace(/\.(tsx|jsx)/g, "");
    if (!name || /^(\_app|index)$/.test(name)) {
        return null;
    }
    if (/^.+\/index$/.test(name)) {
        var cleanName = name.replace(/\/index/, "");
        return [cleanLinkName(cleanName), "/" + cleanName];
    }
    return [cleanLinkName(name), "/" + name];
}
exports.getLink = getLink;
function cleanLinkName(name) {
    return name
        .replace(/(\/|\-)/g, "_")
        .replace(/\[|\]/g, "")
        .toUpperCase();
}
