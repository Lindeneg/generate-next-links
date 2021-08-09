import { exit } from "process";
import { Id } from "./id";
import { walk } from "./walk";
import { Config } from "./config";
import { LogLevel, Logger, log } from "./log";

export type Node = {
  id: number;
  parentId: number | null;
};

export type NodeMap = Map<Node["id"], { name: string; isDir: boolean }>;

export type Parents = { [key: string]: Node["id"] };

export function createNode(id: Node["id"], parentId: Node["parentId"]): Node {
  return { id, parentId };
}

export function getNodeMap(initializeWithIndex = true): NodeMap {
  const map: NodeMap = new Map();
  if (initializeWithIndex) {
    map.set(Id.next(), { name: "/", isDir: true });
  }
  return map;
}

export function getParent(targets: string[]): [string, string] {
  const parent = targets.slice(0, targets.length - 1);
  const parentName = parent[parent.length - 1];
  const parentPath = parent.join("/");
  return [parentName, parentPath];
}

export function getGrandParentId(
  path: string,
  nodes: Node[],
  map: NodeMap,
  parents: Parents
): number {
  const parentPath = path.split("/");
  if (parentPath.length <= 1) {
    return 0;
  }
  const grandParentPath = parentPath.slice(0, parentPath.length - 1).join("/");
  if (!parents[grandParentPath]) {
    const id = Id.next();
    const name = grandParentPath.split("/");
    parents[grandParentPath] = id;
    map.set(id, { name: name[name.length - 1], isDir: true });
    nodes.push(
      createNode(id, getGrandParentId(grandParentPath, nodes, map, parents))
    );
  }
  return parents[grandParentPath];
}

export function generateLinkNodeTree(
  config: Config,
  callback: (nodes: Node[], map: NodeMap) => void,
  logger?: Logger
) {
  walk(config.path, (err, results) => {
    if (err) {
      log(false, LogLevel.Error, "could not walk the target directory: ", err);
      exit(1);
    }
    const nodes: Node[] = [{ id: Id.next(), parentId: null }];
    const map = getNodeMap();
    const parents: Parents = {};
    let indexId: number | null = null;
    results.forEach((result) => {
      const splitted = result.split("pages/");
      let parentId: number | null = null;
      let child: string = "";
      if (splitted.length >= 2) {
        if (!/^(_app|index)\.tsx$/.test(splitted[1])) {
          const targets = splitted[1].split("/");
          child = targets[targets.length - 1].replace(/\.(tsx|jsx)/g, "");
          parentId = handleParent(
            targets,
            nodes,
            map,
            parents,
            parentId,
            logger
          );
        } else {
          logger && logger(LogLevel.Debug, `ignoring file '${splitted[1]}'`);
        }
      }
      const idx = handleChild(child, nodes, map, parentId, indexId, logger);
      if (typeof idx === "number") {
        indexId = idx;
        return;
      }
    });
    callback(nodes, map);
  });
}

function handleChild(
  child: string,
  nodes: Node[],
  map: NodeMap,
  parentId: number | null,
  indexId: number | null,
  logger?: Logger
) {
  if (child !== "") {
    if (child === "index") {
      if (indexId !== null) {
        logger && logger(LogLevel.Debug, `using reuseable node '#${indexId}'`);
        nodes.push(createNode(indexId, parentId));
        return indexId;
      } else {
        const id = Id.next();
        indexId = id;
        logger && logger(LogLevel.Debug, `creating reuseable node '#${id}'`);
        map.set(id, { name: "", isDir: false });
        nodes.push(createNode(id, parentId));
        return indexId;
      }
    } else {
      const id = Id.next();
      map.set(id, { name: child, isDir: false });
      nodes.push(createNode(id, parentId));
      logger && logger(LogLevel.Debug, `found child '${child}#${id}'`);
    }
  }
}

function handleParent(
  targets: string[],
  nodes: Node[],
  map: NodeMap,
  parents: Parents,
  parentId: number | null,
  logger?: Logger
) {
  if (targets.length > 1) {
    const [parentName, parentPath] = getParent(targets);
    if (!parents[parentPath]) {
      parentId = Id.next();
      parents[parentPath] = parentId;
      nodes.push(
        createNode(parentId, getGrandParentId(parentPath, nodes, map, parents))
      );
      map.set(parentId, { name: parentName, isDir: true });
      logger &&
        logger(LogLevel.Debug, `created parent '${parentName}#${parentId}'`);
    } else {
      parentId = parents[parentPath];
      logger &&
        logger(LogLevel.Debug, `used parent '${parentName}#${parentId}'`);
    }
  }

  return parentId;
}
