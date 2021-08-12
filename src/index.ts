import { exit } from "process";
import { Link, generateLinkNodeTree, getLinks } from "./link";
import { createTsLinksEnum } from "./create";
import { Config, getConfig } from "./config";
import { LogLevel, log, getRunTimeInSeconds } from "./log";

export function main(
  config: Config,
  callback: (result: [string, Link[]]) => void = () => {}
) {
  const logger = log.bind(null, !config.verbose);
  generateLinkNodeTree(
    config,
    (map) => {
      if (!map) {
        log(false, LogLevel.Error, "could not generate link tree");
        exit(1);
      }
      const links = getLinks(map).sort((a, b) => (b[0] > a[0] ? -1 : 1));
      createTsLinksEnum(
        links,
        config,
        (content) => {
          logger(LogLevel.Debug, "dry run chosen, no files committed\n");
          log(
            false,
            LogLevel.Debug,
            content,
            `\ndry run generated ${links.length} links in ${getRunTimeInSeconds(
              config.start
            )} seconds`
          );
          if (process.env.NODE_ENV === "test") {
            return callback([config.name, links]);
          } else {
            exit(0);
          }
        },
        logger
      );
    },
    logger
  );
}

module.exports = {
  main,
  getConfig,
};
