import { exit } from "process";
import { getLinkTree, getLinks } from "./link";
import { createTsLinksEnum } from "./create";
import { Config } from "./config";
import { LogLevel, log, getRunTimeInSeconds } from "./log";

export function main(config: Config) {
  const logger = log.bind(null, !config.verbose);
  getLinkTree(
    config,
    (error, root, map) => {
      if (error || !root || !map) {
        log(false, LogLevel.Error, error || "could not generate link tree");
        exit(1);
      }
      const links = getLinks(root, map);
    },
    logger
  );
  /*
  logger(LogLevel.Debug, `sorting ${links.length} nextjs links`);
  const sortedLinks = links.sort((a, b) => (b[0] > a[0] ? -1 : 1));
  if (config.dry) {
    logger(LogLevel.Debug, "dry run chosen, no files committed\n");
    log(
      false,
      LogLevel.Debug,
      config.name,
      sortedLinks,
      `\n\ndry run generated ${
        sortedLinks.length
      } links in ${getRunTimeInSeconds(start)} seconds`
    );
    if (process.env.NODE_ENV === "test") {
      return [config.name, sortedLinks];
    } else {
      exit(0);
    }
  }
  createTsLinksEnum(
    config.out,
    sortedLinks,
    config.name,
    start,
    config.verbose
  );
  */
}
