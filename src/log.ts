export enum LogLevel {
  Debug,
  Warning,
  Error,
}

const logLevel = {
  [LogLevel.Debug]: console.log,
  [LogLevel.Warning]: console.warn,
  [LogLevel.Error]: console.error,
};

export function log(level: LogLevel, ...args: string[]) {
  logLevel[level](...args);
}
