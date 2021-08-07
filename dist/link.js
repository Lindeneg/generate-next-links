"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanLinkName = exports.getLink = exports.convertCamelCase = void 0;
function convertCamelCase(target) {
    var result = [];
    target.split(" ").forEach(function (entry) {
        if (entry != "") {
            var splitWords = entry.split(/(?=[A-Z])/).join("_");
            result.push(splitWords.charAt(0).toUpperCase() + splitWords.slice(1));
        }
    });
    return result.join(" ");
}
exports.convertCamelCase = convertCamelCase;
function getLink(target) {
    var name = target.replace(/^\//, "").replace(/\.(tsx|jsx)/g, "");
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
    return convertCamelCase(name)
        .replace(/^\//, "")
        .replace(/(\/|\-)/g, "_")
        .replace(/\[|\]/g, "")
        .toUpperCase()
        .trim();
}
exports.cleanLinkName = cleanLinkName;
