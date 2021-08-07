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

export function getRunTimeInSeconds(start: number) {
  return ((Date.now() - start) / 1000).toFixed(3);
}

export function log(dry: boolean, level: LogLevel, ...args: unknown[]) {
  process.env.NODE_ENV !== "test" && !dry && logLevel[level](...args);
}
