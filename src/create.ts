import fs from "fs";
import { exit } from "process";
import { format } from "prettier";
import { Config } from "./config";
import { Link } from "./link";
import { Logger, LogLevel, log, getRunTimeInSeconds } from "./log";

export async function createTsLinksEnum(
  links: Link[],
  config: Config,
  dryCallback: (content: string) => void,
  logger?: Logger
) {
  const name = `${config.out}/links_${Date.now()}.ts`;
  let content = `
  export enum ${config.name} {
      ${links.map(([k, v]) => `${k} = "${v}"`)}
  };
  `;
  content =
    process.env.NODE_ENV === "test"
      ? content
      : format(content, { parser: "typescript" });
  if (config.dry) {
    dryCallback(content);
  } else {
    logger && logger(LogLevel.Debug, `creating file: ${name}`);
    fs.writeFile(name, content, (err) => {
      if (err) {
        logger && logger(LogLevel.Error, err);
        exit(1);
      } else {
        log(
          false,
          LogLevel.Debug,
          `generated ${links.length} nextjs links in ${getRunTimeInSeconds(
            config.start
          )} seconds here: ${name}`
        );
      }
    });
  }
}
