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
    { id: 2, parentId: 6 },
    { id: 7, parentId: 6 },
    { id: 8, parentId: 5 },
    { id: 9, parentId: 8 },
    { id: 10, parentId: 0 },
    { id: 11, parentId: 10 },
    { id: 12, parentId: 10 },
    { id: 13, parentId: 10 },
    { id: 2, parentId: 13 },
    { id: 14, parentId: 10 },
    { id: 2, parentId: 14 },
    { id: 15, parentId: 14 },
    { id: 16, parentId: 15 },
    { id: 17, parentId: 15 },
    { id: 18, parentId: 15 },
    { id: 19, parentId: 18 },
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
    [10, { name: "products", isDir: true }],
    [11, { name: "[id]", isDir: false }],
    [12, { name: "edit", isDir: false }],
    [13, { name: "create", isDir: true }],
    [14, { name: "[category]", isDir: true }],
    [15, { name: "theme", isDir: true }],
    [16, { name: "current", isDir: false }],
    [17, { name: "new", isDir: false }],
    [18, { name: "color", isDir: true }],
    [19, { name: "[colorId]", isDir: false }],
  ].forEach((entry) => {
    testMap.set(entry[0], entry[1]);
  });
  return [testNodes, testMap];
}
