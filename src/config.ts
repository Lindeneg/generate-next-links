import fs from "fs";
import path from "path";
import { exit } from "process";
import { LogLevel, log } from "./log";

// should probably just import package.json
const VERSION = "2.1.6";

const HELP = `
Usage: generate-next-links 

If no 'path' is specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 -N --name [NAME]         name of generated TypeScript enum
 -P --path [PATH]         path to folder where 'pages' directory resides
 -O --out  [PATH]         path to folder where ts file will be written to
 -B --base [PATH]         nextjs base path, defaults to '/'
 -A --api                 include API paths found in '/pages/api' folder
 -R --root                include an 'INDEX' entry with path '/'
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
  base: string;
  nativeSeparator: string;
  dry: boolean;
  api: boolean;
  root: boolean;
  verbose: boolean;
  omitTimestamp: boolean;
  exportJson: boolean;
  convertCamelCase: boolean;
  start: number;
};

export function isDirectory(target: string, verbose: boolean): boolean {
  try {
    return fs.lstatSync(target).isDirectory();
  } catch (err) {
    log(!verbose, LogLevel.Warning, err);
  }
  return false;
}

export function getNativeSeparator() {
  return process.platform === "win32" ? "\\" : "/";
}

function parseNextArgs(next: string | undefined, arg: string, config: Config): void {
  if (next) {
    const isName = ["--name", "-N"].includes(arg);
    const target = isName ? next : path.join("/", next);
    if (["--out", "-O"].includes(arg)) {
      config.out = path.join(config.out, target);
    } else if (isName) {
      config.name = target;
    } else if (["--path", "-P"].includes(arg)) {
      config.path = path.join(config.path, target);
    } else if (["--base", "-B"].includes(arg)) {
      config.base = target;
    }
  } else {
    log(
      false,
      LogLevel.Error,
      `a flag '${arg}' that requires an argument was passed without an argument`
    );
    exit(1);
  }
}

export function getConfig(args: string[], root = process.cwd()): Config {
  const config: Config = {
    path: root,
    out: root,
    nativeSeparator: getNativeSeparator(),
    name: "links",
    base: "/",
    dry: false,
    api: false,
    root: false,
    verbose: false,
    omitTimestamp: false,
    exportJson: false,
    convertCamelCase: false,
    start: Date.now(),
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--out":
      case "-O":
      case "--path":
      case "-P":
      case "--name":
      case "-N":
      case "--base":
      case "-B":
        parseNextArgs(args[i + 1], arg, config);
        break;
      case "--version":
      case "-I":
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
      case "--api":
      case "-A":
        config.api = true;
        break;
      case "--root":
      case "-R":
        config.root = true;
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
      case "-H":
        log(false, LogLevel.Debug, HELP);
        exit(0);
      default:
        break;
    }
  }

  if (!/.*\/pages\/*$/.test(config.path)) {
    config.path = path.join(config.path, "pages");
  }

  if (!isDirectory(config.path, config.verbose)) {
    log(false, LogLevel.Error, "`pages` folder not found.. exiting..");
    if (process.env.NODE_ENV === "test") {
      throw new Error("`pages` folder not found.. exiting..");
    } else {
      log(false, LogLevel.Debug, HELP);
      exit(0);
    }
  }
  log(!config.verbose, LogLevel.Debug, "parsed config: ", config);
  return config;
}
