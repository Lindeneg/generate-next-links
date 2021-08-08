import { getParent, getGrandParentId } from "../family";
import { getTestData } from "./test-util";

describe("Family Test Suite", () => {
  const [nodes, map] = getTestData();
  test.each([
    [
      ["products", "edit.tsx"],
      ["products", "products"],
    ],
    [
      ["products", "create", "index.tsx"],
      ["create", "products/create"],
    ],
    [
      ["products", "[category]", "index.tsx"],
      ["[category]", "products/[category]"],
    ],
    [
      ["products", "[category]", "theme", "current.tsx"],
      ["theme", "products/[category]/theme"],
    ],
    [
      ["products", "[category]", "theme", "color", "[colorId].tsx"],
      ["color", "products/[category]/theme/color"],
    ],
  ])("get parent: %s", (targets, parent) => {
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
});
