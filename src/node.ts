import { Id } from "./id";
import { walk } from "./walk";
import { Config } from "./config";
import { LogLevel, Logger } from "./log";
import { Parents, getParent, getGrandParentId } from "./family";

export type Node = {
  id: number;
  parentId: number | null;
};

export type NodeMap = Map<Node["id"], { name: string; isDir: boolean }>;

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

export function generateLinkNodeTree(
  config: Config,
  callback: (nodes: Node[], map: NodeMap) => void,
  logger?: Logger
) {
  walk(config.path, (err, results) => {
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
          if (targets.length > 1) {
            const [parentName, parentPath] = getParent(targets);
            if (!parents[parentPath]) {
              parentId = Id.next();
              parents[parentPath] = parentId;
              map.set(parentId, { name: parentName, isDir: true });
              logger &&
                logger(
                  LogLevel.Debug,
                  `found parent '${parentName}#${parentId}'`
                );
              nodes.push(
                createNode(parentId, getGrandParentId(parentPath, parents))
              );
            } else {
              parentId = parents[parentPath];
            }
          }
        } else {
          logger && logger(LogLevel.Debug, `ignoring file '${splitted[1]}'`);
        }
      }
      if (child !== "") {
        let childName = child;
        if (child === "index") {
          if (indexId !== null) {
            logger &&
              logger(LogLevel.Debug, `using reuseable node '#${indexId}'`);
            nodes.push(createNode(indexId, parentId));
            return;
          } else {
            const id = Id.next();
            indexId = id;
            logger &&
              logger(LogLevel.Debug, `creating reuseable node '#${id}'`);
            map.set(id, { name: "", isDir: false });
            nodes.push(createNode(id, parentId));
            return;
          }
        } else {
          const id = Id.next();
          map.set(id, { name: childName, isDir: false });
          nodes.push(createNode(id, parentId));
          logger && logger(LogLevel.Debug, `found child '${child}#${id}'`);
        }
      }
    });
    callback(nodes, map);
  });
}

export function getLinkTree(
  config: Config,
  callback: (
    err: string | null,
    root: Node[] | null,
    map: NodeMap | null
  ) => void,
  logger?: Logger
) {
  logger && logger(LogLevel.Debug, "building node tree..");
  generateLinkNodeTree(
    config,
    (nodes, map) => {
      callback(null, nodes, map);
      /*
      logger &&
        logger(
          LogLevel.Debug,
          `built tree with ${map.size} nodes`,
          "\nbuilding link tree.."
        );
      const idMapping = nodes.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {} as { [key: number]: number });
      let root: Node | null = null;
      let error: string | null = null;
      nodes.forEach((el) => {
        if (el.parentId !== null) {
          const parentEl = nodes[idMapping[el.parentId]];
          parentEl.children = [...(parentEl.children || []), el];
        } else {
          root = el;
        }
      });
      if (!root) {
        error = `could not generate root node for link tree: ${nodes}`;
      }
      callback(error, root, map);
      */
    },
    logger
  );
}
