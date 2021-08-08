import { Id } from "./id";
import { walk } from "./walk";
import { Config } from "./config";
import { LogLevel, Logger } from "./log";
import { Parents, getParent, getGrandParentId } from "./family";
import { Node, NodeMap, createNode, getNodeMap } from "./node";

export type Link = [string, string];

export function convertCamelCase(target: string) {
  const result: string[] = [];
  target.split(" ").forEach((entry) => {
    if (entry != "") {
      let splitWords = entry.split(/(?=[A-Z])/).join("_");
      result.push(splitWords.charAt(0).toUpperCase() + splitWords.slice(1));
    }
  });
  return result.join(" ");
}

export function cleanLinkName(name: string) {
  return convertCamelCase(name)
    .replace(/^\//, "")
    .replace(/(\/|\-)/g, "_")
    .replace(/\[|\]/g, "")
    .toUpperCase()
    .trim();
}

export function getLinks(root: Node, map: NodeMap): string[] {
  console.log(root, map);
  return [];
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
              map.set(parentId, parentName);
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
        const id = Id.next();
        logger && logger(LogLevel.Debug, `found child '${child}#${id}'`);
        map.set(id, child === "index" ? "" : child);
        nodes.push(createNode(id, parentId));
      }
    });
    callback(nodes, map);
  });
}

export function getLinkTree(
  config: Config,
  callback: (
    err: string | null,
    root: Node | null,
    map: NodeMap | null
  ) => void,
  logger?: Logger
) {
  logger && logger(LogLevel.Debug, "building node tree..");
  generateLinkNodeTree(
    config,
    (nodes, map) => {
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
    },
    logger
  );
}
