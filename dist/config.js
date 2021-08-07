"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.isDirectory = void 0;
var fs_1 = __importDefault(require("fs"));
var process_1 = require("process");
var log_1 = require("./log");
var HELP = "\nUsage: generate-next-links \n\nIf no args are specified, a 'pages' folder must be located\ninside the folder where the script is running from\n\nOptions:\n --name      Name of generated TypeScript enum\n --path      Path to folder where 'pages' directory resides\n --out       Path where TypeScript file will be written to\n --dry       Perform all operations except writing to disk\n --verbose   Show all log messages in stdout\n --help      Show help                                                \n --version   Show version number\n\n";
function isDirectory(target, path, verbose) {
    try {
        return fs_1.default.lstatSync(path + "/" + target).isDirectory();
    }
    catch (err) {
        log_1.log(!verbose, log_1.LogLevel.Warning, err);
    }
    return false;
}
exports.isDirectory = isDirectory;
function getConfig(rootPath, args) {
    var config = {
        path: rootPath,
        out: rootPath,
        name: "links",
        dry: false,
        verbose: false,
    };
    if (args.length >= 3) {
        for (var i = 2; i < args.length; i++) {
            var arg = args[i];
            switch (arg) {
                case "--out":
                case "--path":
                case "--name":
                    if (i + 1 < args.length) {
                        var target = (args[i + 1].startsWith("/") || arg === "--name" ? "" : "/") +
                            args[i + 1];
                        if (arg === "--out") {
                            config.out += target;
                        }
                        else if (arg === "--name") {
                            config.name = target;
                        }
                        else {
                            config.path += target;
                        }
                    }
                    break;
                case "--dry":
                    config.dry = true;
                    break;
                case "--verbose":
                    config.verbose = true;
                    break;
                case "--help":
                    log_1.log(false, log_1.LogLevel.Debug, HELP);
                    process_1.exit(0);
                default:
                    break;
            }
        }
    }
    if (!isDirectory("pages", config.path, config.verbose)) {
        log_1.log(false, log_1.LogLevel.Error, "`pages` folder not found.. exiting..");
        if (process.env.NODE_ENV === "test") {
            throw new Error("`pages` folder not found.. exiting..");
        }
        else {
            log_1.log(false, log_1.LogLevel.Debug, HELP);
            process_1.exit(0);
        }
    }
    config.path += (config.path.endsWith("/") ? "" : "/") + "pages";
    log_1.log(!config.verbose, log_1.LogLevel.Debug, "parsed config: ", config);
    return config;
}
exports.getConfig = getConfig;
