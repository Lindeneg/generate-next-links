import fs from "fs";
import { exit } from "process";
import { LogLevel, log } from "./log";

const VERSION = "2.0.7";

const HELP = `
Usage: generate-next-links 

If no args are specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 -N --name [NAME]         name of generated TypeScript enum
 -P --path [PATH]         path to folder where 'pages' directory resides
 -O --out  [PATH]         path to folder where ts file will be written to
 -D --dry                 perform all operations except writing to disk
 -V --verbose             show all log messages in stdout
 -T --omit-timestamp      omit timestamp from written ts file
 -J --export-json         export json instead of ts enum
 -C --convert-camel-case  convert camel case to be delimited by underscore
 -I --version             show current version
 -H --help                show help                                                

`;

export type Config = {
  path: string;
  out: string;
  name: string;
  dry: boolean;
  verbose: boolean;
  omitTimestamp: boolean;
  exportJson: boolean;
  convertCamelCase: boolean;
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
    omitTimestamp: false,
    exportJson: false,
    convertCamelCase: false,
    start: Date.now(),
  };
  if (args.length >= 3) {
    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case "--out":
        case "-O":
        case "--path":
        case "-P":
        case "--name":
        case "-N":
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
        case "-D":
          config.dry = true;
          break;
        case "--verbose":
        case "-V":
          config.verbose = true;
          break;
        case "--omit-timestamp":
        case "-T":
          config.omitTimestamp = true;
          break;
        case "--convert-camel-case":
        case "-C":
          config.convertCamelCase = true;
          break;
        case "--export-json":
        case "-J":
          config.exportJson = true;
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
