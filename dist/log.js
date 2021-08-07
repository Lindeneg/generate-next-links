"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.getRunTimeInSeconds = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    LogLevel[LogLevel["Warning"] = 1] = "Warning";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var logLevel = (_a = {},
    _a[LogLevel.Debug] = console.log,
    _a[LogLevel.Warning] = console.warn,
    _a[LogLevel.Error] = console.error,
    _a);
function getRunTimeInSeconds(start) {
    return ((Date.now() - start) / 1000).toFixed(3);
}
exports.getRunTimeInSeconds = getRunTimeInSeconds;
function log(dry, level) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    !dry && logLevel[level].apply(logLevel, args);
}
exports.log = log;
