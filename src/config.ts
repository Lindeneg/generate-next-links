import fs from "fs";
import { exit } from "process";
import { LogLevel, log } from "./log";

export type Config = {
  path: string;
  out: string;
  name: string;
  dry: boolean;
  verbose: boolean;
};

export function isDirectory(
  target: string,
  path: string,
  verbose: boolean
): boolean {
  try {
    return fs.lstatSync(`${path}/${target}`).isDirectory();
  } catch (err) {
    verbose && console.error(err);
  }
  return false;
}

export function getConfig(rootPath: string, args: string[]): Config {
  const config = {
    path: rootPath,
    out: rootPath,
    name: "links",
    dry: false,
    verbose: false,
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
        case "--dry":
          config.dry = true;
          break;
        case "--verbose":
          config.verbose = true;
          break;
        default:
          break;
      }
    }
  }
  if (!isDirectory("pages", config.path, config.verbose)) {
    console.log(
      "please run the script inside a directory with a `pages` folder or specify a `--path` argument."
    );
    exit(0);
  }
  config.path += (config.path.endsWith("/") ? "" : "/") + "pages";
  config.verbose && console.log("parsed config: ", config);
  return config;
}
