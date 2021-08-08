import { Id } from "./id";

export type Node = {
  id: number;
  parentId: number | null;
  children?: Node[];
};

export type NodeMap = Map<Node["id"], string>;

export function createNode(id: Node["id"], parentId: Node["parentId"]): Node {
  return { id, parentId };
}

export function getNodeMap(initializeWithIndex = true): NodeMap {
  const map: NodeMap = new Map();
  if (initializeWithIndex) {
    map.set(Id.next(), "/");
  }
  return map;
}
