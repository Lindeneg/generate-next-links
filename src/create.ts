import fs from "fs";
import { exit } from "process";
import { format } from "prettier";
import { Config } from "./config";
import { Link } from "./link";
import { Logger, LogLevel, log, getRunTimeInSeconds } from "./log";

function getContent(links: Link[], config: Config): string {
  if (config.exportJson) {
    return JSON.stringify(
      links.reduce((a, b) => {
        return {
          ...a,
          [b[0]]: b[1],
        };
      }, {})
    );
  }
  return `
  export enum ${config.name} {
      ${links.map(([k, v]) => `${k} = "${v}"`)}
  };
  `;
}

export async function createTsLinksEnum(
  links: Link[],
  config: Config,
  dryCallback: (content: string) => void,
  logger?: Logger
) {
  const name = `${config.out}/links${
    config.omitTimestamp ? "" : "_" + Date.now()
  }.${config.exportJson ? "json" : "ts"}`;
  let content = getContent(links, config);
  content =
    process.env.NODE_ENV === "test"
      ? content
      : format(content, { parser: config.exportJson ? "json" : "typescript" });
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
