import { exit } from "process";
import { getLinks } from "./link";
import { generateLinkNodeTree } from "./node";
import { createTsLinksEnum } from "./create";
import { Config } from "./config";
import { LogLevel, log, getRunTimeInSeconds } from "./log";

export function main(config: Config) {
  const logger = log.bind(null, !config.verbose);
  generateLinkNodeTree(
    config,
    (nodes, map) => {
      if (!nodes || !map) {
        log(false, LogLevel.Error, "could not generate link tree");
        exit(1);
      }
      const links = getLinks(nodes, map).sort((a, b) => (b[0] > a[0] ? -1 : 1));
      if (config.dry) {
        logger(LogLevel.Debug, "dry run chosen, no files committed\n");
        log(
          false,
          LogLevel.Debug,
          config.name,
          links.map((link) => link[1]),
          `\n\ndry run generated ${links.length} links in ${getRunTimeInSeconds(
            config.start
          )} seconds`
        );
        if (process.env.NODE_ENV === "test") {
          return [config.name, links];
        } else {
          exit(0);
        }
      }
      createTsLinksEnum(
        config.out,
        links,
        config.name,
        config.start,
        config.verbose
      );
    },
    logger
  );
}
