import { Node, NodeMap } from "../node";

export function getTestData(): [Node[], NodeMap] {
  const testNodes = [
    { id: 0, parentId: null },
    { id: 1, parentId: 0 },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 0 },
    { id: 4, parentId: 3 },
    { id: 5, parentId: 0 },
    { id: 2, parentId: 5 },
    { id: 6, parentId: 5 },
    { id: 7, parentId: 6 },
    { id: 8, parentId: 5 },
    { id: 2, parentId: 8 },
    { id: 9, parentId: 8 },
    { id: 10, parentId: 0 },
  ];

  const testMap = new Map();

  [
    [0, { name: "/", isDir: true }],
    [1, { name: "[customerId]", isDir: true }],
    [2, { name: "", isDir: false }],
    [3, { name: "faq", isDir: true }],
    [4, { name: "[language]", isDir: false }],
    [5, { name: "admin", isDir: true }],
    [6, { name: "user", isDir: true }],
    [7, { name: "[id]", isDir: false }],
    [8, { name: "blog", isDir: true }],
    [9, { name: "posts", isDir: false }],
    [10, { name: "products", isDir: false }],
  ].forEach((entry) => {
    testMap.set(entry[0], entry[1]);
  });
  return [testNodes, testMap];
}
