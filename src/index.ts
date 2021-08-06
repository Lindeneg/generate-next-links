import glob from "glob";
import { Link, getLink } from "./link";
import { createTsLinksEnum } from "./create";
import { Config } from "./config";
import { exit } from "process";

export function main(config: Config) {
  const links: Link[] = [];
  const start = Date.now();
  glob.sync(`${config.path}{/**/*.jsx,/**/*.tsx}`).map((f) => {
    const names = f.split("pages/");
    if (names.length >= 2) {
      const name = names[1];
      const linkNames = getLink(name);
      if (linkNames) {
        config.verbose &&
          console.log(`found nextjs link path: '${linkNames[1]}'`);
        links.push(linkNames);
      } else {
        config.verbose && console.log(`ignoring file: '${name}'`);
      }
    } else {
      console.log(`error: name did not contain 'pages' in its path: ${f}`);
      exit(1);
    }
  });
  config.verbose && console.log(`found ${links.length} links in total`);
  const sortedLinks = links.sort((a, b) => (b[0] > a[0] ? -1 : 1));
  if (config.dry) {
    config.verbose && console.log("dry run chosen, no files committed...\n");
    console.log(config.name, sortedLinks);
    exit(0);
  }
  createTsLinksEnum(
    config.out,
    sortedLinks,
    config.name,
    start,
    config.verbose
  );
}
