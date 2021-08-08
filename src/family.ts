import { Node } from "./node";

export type Parents = { [key: string]: Node["id"] };

export function getParent(targets: string[]): [string, string] {
  const parent = targets.slice(0, targets.length - 1);
  const parentName = parent[parent.length - 1];
  const parentPath = parent.join("/");
  return [parentName, parentPath];
}

export function getGrandParentId(path: string, parents: Parents): number {
  const parentPath = path.split("/");
  if (parentPath.length <= 1) {
    return 0;
  }
  const grandParentPath = parentPath.slice(0, parentPath.length - 1).join("/");
  return parents[grandParentPath] || 0;
}
