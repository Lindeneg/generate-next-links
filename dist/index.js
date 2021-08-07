"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var glob_1 = __importDefault(require("glob"));
var process_1 = require("process");
var link_1 = require("./link");
var create_1 = require("./create");
var log_1 = require("./log");
function main(config) {
    var logger = log_1.log.bind(null, !config.verbose);
    var links = [];
    var start = Date.now();
    glob_1.default.sync(config.path + "{/**/*.jsx,/**/*.tsx}").map(function (f) {
        var names = f.split("pages/");
        if (names.length >= 2) {
            var name_1 = names[1];
            var linkNames = link_1.getLink(name_1);
            if (linkNames) {
                logger(log_1.LogLevel.Debug, "found nextjs link path: '" + linkNames[1] + "'");
                links.push(linkNames);
            }
            else {
                logger(log_1.LogLevel.Debug, "ignoring file: '" + name_1 + "'");
            }
        }
        else {
            logger(log_1.LogLevel.Error, "error: name did not contain 'pages' in its path: " + f);
            process_1.exit(1);
        }
    });
    logger(log_1.LogLevel.Debug, "sorting " + links.length + " nextjs links");
    var sortedLinks = links.sort(function (a, b) { return (b[0] > a[0] ? -1 : 1); });
    if (config.dry) {
        logger(log_1.LogLevel.Debug, "dry run chosen, no files committed\n");
        log_1.log(false, log_1.LogLevel.Debug, config.name, sortedLinks, "\n\ndry run generated " + sortedLinks.length + " links in " + log_1.getRunTimeInSeconds(start) + " seconds");
        process_1.exit(0);
    }
    create_1.createTsLinksEnum(config.out, sortedLinks, config.name, start, config.verbose);
}
exports.main = main;
