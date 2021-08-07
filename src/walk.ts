import fs from "fs";
import path from "path";

/* work-in-progress */

type Node = {
  id: number;
  parentId: number | null;
};

type NodeMap = Map<Node["id"], string>;

class Id {
  private static CURRENT = 0;
  private static hasCalled = false;

  public static next() {
    if (Id.CURRENT === 0 && !Id.hasCalled) {
      Id.hasCalled = true;
      return Id.CURRENT;
    }
    return Id.CURRENT++;
  }
}

function walk(
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

walk("__mock__", (err, results) => {
  console.log(results);
  const root: Node = { id: Id.next(), parentId: null };
  const data: Node[] = [root];
  const map: NodeMap = new Map();
  map.set(root.id, "/");
  const parents: { [k: string]: Node["id"] } = {};
  console.log(results);
  results.forEach((result) => {
    let id = Id.next();
    let parentId = root.id;
    let child = "";
    const splitted = result.split("pages/");
    if (splitted.length >= 2) {
      const targets = splitted[1].split("/");
      child = targets[targets.length - 1].replace(/\.(tsx|jsx)/g, "");
      if (targets.length > 1) {
        const parent = targets.slice(0, targets.length - 1).join("/");
        if (!parents[parent]) {
          parentId = Id.next();
          parents[parent] = parentId;
        } else {
          parentId = parents[parent];
        }
      }
    }
    if (child !== "") {
      map.set(id, child);
      data.push({ id, parentId });
    }
  });
  console.log(data, map);
});
