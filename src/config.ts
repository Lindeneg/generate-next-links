import fs from "fs";
import { exit } from "process";
import { LogLevel, log } from "./log";

const VERSION = "2.0.6";

const HELP = `
Usage: generate-next-links 

If no args are specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 --name      Name of generated TypeScript enum
 --path      Path to folder where 'pages' directory resides
 --out       Path where TypeScript file will be written to
 --dry       Perform all operations except writing to disk
 --verbose   Show all log messages in stdout
 --version   Show current version
 --help      Show help                                                

`;

export type Config = {
  path: string;
  out: string;
  name: string;
  dry: boolean;
  verbose: boolean;
  start: number;
};

export function isDirectory(
  target: string,
  path: string,
  verbose: boolean
): boolean {
  try {
    return fs.lstatSync(`${path}/${target}`).isDirectory();
  } catch (err) {
    log(!verbose, LogLevel.Warning, err);
  }
  return false;
}

export function getConfig(rootPath: string, args: string[]): Config {
  const config: Config = {
    path: rootPath,
    out: rootPath,
    name: "links",
    dry: false,
    verbose: false,
    start: Date.now(),
  };
  if (args.length >= 3) {
    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case "--out":
        case "--path":
        case "--name":
          if (i + 1 < args.length) {
            const target =
              (args[i + 1].startsWith("/") || arg === "--name" ? "" : "/") +
              args[i + 1];
            if (arg === "--out") {
              config.out += target;
            } else if (arg === "--name") {
              config.name = target;
            } else {
              config.path += target;
            }
          }
          break;
        case "--version":
          log(false, LogLevel.Debug, `version: ${VERSION}`);
          exit(0);
        case "--dry":
          config.dry = true;
          break;
        case "--verbose":
          config.verbose = true;
          break;
        case "--help":
          log(false, LogLevel.Debug, HELP);
          exit(0);
        default:
          break;
      }
    }
  }
  if (!isDirectory("pages", config.path, config.verbose)) {
    log(false, LogLevel.Error, "`pages` folder not found.. exiting..");
    if (process.env.NODE_ENV === "test") {
      throw new Error("`pages` folder not found.. exiting..");
    } else {
      log(false, LogLevel.Debug, HELP);
      exit(0);
    }
  }
  config.path += (config.path.endsWith("/") ? "" : "/") + "pages";
  log(!config.verbose, LogLevel.Debug, "parsed config: ", config);
  return config;
}
