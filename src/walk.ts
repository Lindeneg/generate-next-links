import fs from "fs";
import path from "path";

/* work-in-progress */

type Node = {
  id: number;
  parentId: number | null;
  children?: Node[];
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

function generateLinkNodeTree(callback: (nodes: Node[], map: NodeMap) => void) {
  walk("__mock__", (err, results) => {
    const root: Node = { id: Id.next(), parentId: null };
    const nodes: Node[] = [root];
    const map: NodeMap = new Map();
    map.set(root.id, "/");
    const parents: { [k: string]: Node["id"] } = {};
    results.forEach((result) => {
      let parentId = root.id;
      let child = "";
      const splitted = result.split("pages/");
      if (splitted.length >= 2) {
        if (!/^(_app|index)\.tsx$/.test(splitted[1])) {
          const targets = splitted[1].split("/");
          child = targets[targets.length - 1].replace(/\.(tsx|jsx)/g, "");
          if (targets.length > 1) {
            const parent = targets.slice(0, targets.length - 1);
            const parentName = parent[parent.length - 1];
            const parentPath = parent.join("/");
            if (!parents[parentPath]) {
              parentId = Id.next();
              parents[parentPath] = parentId;
              map.set(parentId, parentName);
              // push to nodes
              console.log(parentPath, parentName);
            } else {
              parentId = parents[parentPath];
            }
          }
        }
      }
      if (child !== "") {
        const id = Id.next();
        map.set(id, child);
        nodes.push({ id, parentId });
      }
    });
    callback(nodes, map);
  });
}

generateLinkNodeTree((nodes, map) => {
  const idMapping = nodes.reduce((acc, el, i) => {
    //@ts-ignore
    acc[el.id] = i;
    return acc;
  }, {});
  let root;
  nodes.forEach((el) => {
    // Handle the root element
    if (el.parentId === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our data array
    //@ts-ignore
    const parentEl = nodes[idMapping[el.parentId]];
    console.log(el.parentId);
    console.log(parentEl);
    // Add our current el to its parent's `children` array
    //parentEl.children = [...(parentEl.children || []), el];
  });
  console.log(root);
});
