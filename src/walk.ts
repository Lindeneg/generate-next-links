import fs from "fs";
import path from "path";

export function walk(
  api: boolean,
  target: string,
  separator: string,
  callback: (err: NodeJS.ErrnoException | null, results: string[]) => void
) {
  const regex = api
    ? new RegExp(`^(.+\.(tsx|jsx)|.+\\${separator}api\\${separator}.+\.ts)$`)
    : /^.+\.(tsx|jsx)$/;
  let results: string[] = [];
  fs.readdir(target, (err, files) => {
    if (err) {
      return callback(err, []);
    }
    let pending = files.length;
    if (!pending) {
      return callback(null, results);
    }
    files.forEach((file) => {
      file = path.resolve(target, file);
      fs.stat(file, (_, stat) => {
        if (stat && stat.isDirectory()) {
          walk(api, file, separator, (err, res) => {
            results = results.concat(res);
            if (!--pending) {
              callback(null, results);
            }
          });
        } else {
          if (regex.test(file)) {
            results.push(file);
          }
          if (!--pending) {
            callback(null, results);
          }
        }
      });
    });
  });
}
