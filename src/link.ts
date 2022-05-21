import { exit } from "process";
import { MapValue, NodeMap } from "./node";
import { walk } from "./walk";
import { Config } from "./config";
import { LogLevel, Logger, log } from "./log";

export type Link = [string, string];

const separatorRegex = /\/(\[){1,2}\.{3}[a-zA-Z]+(\]){1,2}/;

function clean(
  target: string,
  callback: (item: string, idx: number) => string
) {
  let result = "";
  for (let i = 0; i < target.length; i++) {
    result += callback(target[i], i);
  }
  return result;
}

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

export function cleanLinkName(name: string, doConvertCamelCase: boolean) {
  const notSeparator = new RegExp(`^${separatorRegex.source}$`).test(name);
  const target = (doConvertCamelCase ? convertCamelCase(name) : name).replace(
    separatorRegex,
    (e) => {
      const isOpt = (e.match(/(\[)|(\])/g) || []).length === 4;
      const label = /\.{3}([a-zA-Z]+)/.exec(e);
      if (label && label.length > 1) {
        const prefix =
          (notSeparator ? "" : "_") +
          (isOpt ? "optional_catchall_" : "catchall_");
        return prefix + label[1];
      }
      return e;
    }
  );
  return clean(target, (e, i) => {
    if (e === "/" && i > 0) {
      return "_";
    } else if ((e === "/" && i === 0) || ["[", "]", " ", "-"].includes(e)) {
      return "";
    }
    return e.toUpperCase();
  });
}

export function buildLinkPath(
  node: MapValue | undefined,
  nodeMap: NodeMap,
  link = ""
): string {
  if (node) {
    if (node.parentId !== null) {
      return buildLinkPath(
        nodeMap.getNode(node.parentId),
        nodeMap,
        `/${node.name}${link}`
      );
    } else {
      if (node.name !== "/") {
        link = node.name + link;
      }
    }
  }
  return link;
}

export function getLinks(nodeMap: NodeMap, doConvertCamelCase: boolean) {
  const links: Link[] = [];
  const keys = nodeMap.keys();
  for (let key of keys) {
    const node = nodeMap.getNode(key);
    if (!node?.isDir) {
      let linkPath = buildLinkPath(node, nodeMap);
      linkPath = linkPath.endsWith("/")
        ? linkPath.substring(0, linkPath.length - 1)
        : linkPath;
      linkPath &&
        links.push([cleanLinkName(linkPath, doConvertCamelCase), linkPath]);
    }
  }
  return links;
}

export function generateLinkNodeTree(
  config: Config,
  callback: (map: NodeMap) => void,
  logger?: Logger
) {
  walk(config.api, config.path, (err, results) => {
    if (err) {
      log(false, LogLevel.Error, "could not walk the target directory: ", err);
      exit(1);
    }
    const nodeMap = new NodeMap(logger);
    const reExt = config.api ? /\.(tsx|jsx|ts)/g : /\.(tsx|jsx)/g;
    nodeMap.setNode({ name: config.base, isDir: true, parentId: null });
    results.forEach((result) => {
      const splitted = result.split("pages" + config.nativeSeparator);
      let parentId: number | null = null;
      let child: string = "";
      if (splitted.length >= 2) {
        if (!/^(_app|_document|index)\.tsx$/.test(splitted[1])) {
          const targets = splitted[1].split(config.nativeSeparator);
          child = targets[targets.length - 1].replace(reExt, "");
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
