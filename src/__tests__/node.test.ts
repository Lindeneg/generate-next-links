import { generateLinkNodeTree } from "../node";
import { getConfig } from "../config";
import { getTestData } from "./test-util";

describe("Node Test Suite", () => {
  const [testNodes, testMap] = getTestData();
  test("can generate link node tree", () => {
    generateLinkNodeTree(getConfig("./__mock__", []), (nodes) => {
      expect(nodes).toEqual(testNodes);
    });
  });
});
