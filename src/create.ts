import fs from "fs";
import { exec } from "child_process";
import { Link } from "./link";

export async function createTsLinksEnum(
  path: string,
  links: Link[],
  enumName: string,
  start = Date.now(),
  verbose = false
) {
  const name = `${path}/links_${Date.now()}.ts`;
  verbose && console.log(`creating file: ${name}`);
  fs.writeFile(
    name,
    `
    enum ${enumName} {
        ${links.map(([k, v]) => `${k} = "${v}"`)}
    };
    `,
    (err) => {
      if (!err) {
        console.log("formatting file..");
        exec(`npx prettier --write ${name}`, (error, stdout, stderr) => {
          if (error) {
            verbose && console.log(`error: ${error.message}`);
          } else if (stderr) {
            verbose && console.log(`stderr: ${stderr}`);
          } else {
            verbose && console.log(`nextjs links enum successfully created`);
            verbose &&
              console.log(
                `finished running in ${((Date.now() - start) / 1000).toFixed(
                  3
                )} seconds`
              );
          }
        });
      } else {
        verbose && console.log(err);
      }
    }
  );
}
