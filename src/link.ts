import { Node, NodeMap } from "./node";

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
  node: Node,
  map: NodeMap,
  nodes: Node[],
  link = ""
): string {
  if (node.parentId !== null || nodes.length !== 0) {
    const mapNode = map.get(node.id);
    const metaNode = nodes.find((e) => e.id === node.parentId);
    if (metaNode && mapNode) {
      return buildLinkPath(metaNode, map, nodes, `/${mapNode.name}${link}`);
    }
  }
  return link;
}

export function getLinks(nodes: Node[], map: NodeMap) {
  const links: Link[] = [];
  nodes.forEach((node) => {
    if (!map.get(node.id)?.isDir) {
      let linkPath = buildLinkPath(node, map, nodes);
      linkPath = linkPath.endsWith("/")
        ? linkPath.substr(0, linkPath.length - 1)
        : linkPath;
      linkPath && links.push([cleanLinkName(linkPath), linkPath]);
    }
  });
  return links;
}
