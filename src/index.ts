import { exit } from "process";
import { Link, getLink } from "./link";
import { createTsLinksEnum } from "./create";
import { Config } from "./config";
import { LogLevel, log, getRunTimeInSeconds } from "./log";

export function main(config: Config) {
  const logger = log.bind(null, !config.verbose);
  const links: Link[] = [];
  const start = Date.now();
  //glob.sync(`${config.path}{/**/*.jsx,/**/*.tsx}`).map((f) => {
  /*
    const names = f.split("pages/");
    if (names.length >= 2) {
      const name = names[1];
      const linkNames = getLink(name);
      if (linkNames) {
        logger(LogLevel.Debug, `found nextjs link path: '${linkNames[1]}'`);
        links.push(linkNames);
      } else {
        logger(LogLevel.Debug, `ignoring file: '${name}'`);
      }
    } else {
      logger(
        LogLevel.Error,
        `error: name did not contain 'pages' in its path: ${f}`
      );
      exit(1);
    }
  });
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
