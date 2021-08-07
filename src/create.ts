import fs from "fs";
import { exec } from "child_process";
import { Link } from "./link";
import { LogLevel, log, getRunTimeInSeconds } from "./log";

export async function createTsLinksEnum(
  path: string,
  links: Link[],
  enumName: string,
  start = Date.now(),
  verbose = false
) {
  const logger = log.bind(null, !verbose);
  const name = `${path}/links_${Date.now()}.ts`;
  logger(LogLevel.Debug, `creating file: ${name}`);
  fs.writeFile(
    name,
    `
    export enum ${enumName} {
        ${links.map(([k, v]) => `${k} = "${v}"`)}
    };
    `,
    (err) => {
      if (!err) {
        logger(LogLevel.Debug, `formatting file with prettier...`);
        exec(`npx prettier --write ${name}`, (error, stdout, stderr) => {
          if (error) {
            log(
              false,
              LogLevel.Warning,
              "failed to format file with prettier.."
            );
            logger(LogLevel.Error, error.message);
          } else if (stderr) {
            log(
              false,
              LogLevel.Warning,
              "failed to run prettier format command.."
            );
            logger(LogLevel.Error, stderr);
          } else {
            log(
              false,
              LogLevel.Debug,
              `generated ${links.length} nextjs links in ${getRunTimeInSeconds(
                start
              )} seconds here: ${name}`
            );
          }
        });
      } else {
        logger(LogLevel.Error, err);
      }
    }
  );
}

export function createJsLinksObject() {}
