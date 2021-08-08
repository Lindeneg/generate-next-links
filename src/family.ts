import { Id } from "./id";
import { Node, NodeMap, createNode } from "./node";

export type Parents = { [key: string]: Node["id"] };

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
