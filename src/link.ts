import { exit } from "process";
import { MapValue, NodeMap } from "./node";
import { walk } from "./walk";
import { Config } from "./config";
import { LogLevel, Logger, log } from "./log";

export type Link = [string, string];

export function convertCamelCase(target: string) {
  const result: string[] = [];
  target.split(" ").forEach((entry) => {
    if (entry !== "") {
      const splitWords = entry.split(/(?=[A-Z])/).join("_");
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

export function buildLinkPath(
  node: MapValue | undefined,
  nodeMap: NodeMap,
  link = ""
): string {
  if (node && node.parentId !== null) {
    return buildLinkPath(
      nodeMap.getNode(node.parentId),
      nodeMap,
      `/${node.name}${link}`
    );
  }
  return link;
}

export function getLinks(nodeMap: NodeMap) {
  const links: Link[] = [];
  const keys = nodeMap.keys();
  for (let key of keys) {
    const node = nodeMap.getNode(key);
    if (!node?.isDir) {
      let linkPath = buildLinkPath(node, nodeMap);
      linkPath = linkPath.endsWith("/")
        ? linkPath.substr(0, linkPath.length - 1)
        : linkPath;
      linkPath && links.push([cleanLinkName(linkPath), linkPath]);
    }
  }
  return links;
}

export function generateLinkNodeTree(
  config: Config,
  callback: (map: NodeMap) => void,
  logger?: Logger
) {
  walk(config.path, (err, results) => {
    if (err) {
      log(false, LogLevel.Error, "could not walk the target directory: ", err);
      exit(1);
    }
    const nodeMap = new NodeMap(logger);
    nodeMap.setNode({ name: "/", isDir: true, parentId: null });
    results.forEach((result) => {
      const splitted = result.split("pages/");
      let parentId: number | null = null;
      let child: string = "";
      if (splitted.length >= 2) {
        if (!/^(_app|index)\.tsx$/.test(splitted[1])) {
          const targets = splitted[1].split("/");
          child = targets[targets.length - 1].replace(/\.(tsx|jsx)/g, "");
          parentId = nodeMap.handleParent(targets, parentId);
        } else {
          logger && logger(LogLevel.Debug, `ignoring file '${splitted[1]}'`);
        }
      }
      nodeMap.handleChild(child, parentId);
    });
    callback(nodeMap);
  });
}
