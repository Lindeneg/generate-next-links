import { NodeMap } from "../node";
//import { getTestData } from "./test-util";

describe("Node Test Suite", () => {
  test("", () => {});
  /*
  const [nodes, map] = getTestData();
  test("can generate link node tree", () => {
    generateLinkNodeTree(getConfig("./__mock__", []), (nodes) => {
      expect(nodes.length).toEqual(24);
    });
  });
  test.each([
    [
      "products/edit => products",
      ["products", "edit.tsx"],
      ["products", "products"],
    ],
    [
      "products/create/index => create",
      ["products", "create", "index.tsx"],
      ["create", "products/create"],
    ],
    [
      "products/[category]/index => [category]",
      ["products", "[category]", "index.tsx"],
      ["[category]", "products/[category]"],
    ],
    [
      "products/[category]/theme/current => theme",
      ["products", "[category]", "theme", "current.tsx"],
      ["theme", "products/[category]/theme"],
    ],
    [
      "products/[category]/theme/color/[colorId] => color",
      ["products", "[category]", "theme", "color", "[colorId].tsx"],
      ["color", "products/[category]/theme/color"],
    ],
  ])("get parent: %s", (_, targets, parent) => {
    expect(getParent(targets)).toEqual(parent);
  });
  test.each([
    ["/faq/[language]", 0],
    ["/admin/blog", 1],
    ["/admin/blog/posts", 3],
    ["/products", 6],
  ])("get grand parent id: %s => %i", (before, after) => {
    expect(getGrandParentId(before, nodes, map, {})).toBe(after);
  });
  */
});
