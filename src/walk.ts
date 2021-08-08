import fs from "fs";
import path from "path";

export function walk(
  target: string,
  callback: (err: NodeJS.ErrnoException | null, results: string[]) => void
) {
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
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) {
              callback(null, results);
            }
          });
        } else {
          if (/(^.+\.(tsx|jsx)|(?!.+\/pages\/index.tsx))$/.test(file)) {
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
