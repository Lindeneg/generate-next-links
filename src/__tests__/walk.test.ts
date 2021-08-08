import { walk } from "../walk";

describe("Walk Test Suite", () => {
  test("can walk __mock__ directory", () => {
    walk("__mock__", (err, results) => {
      expect(results.map((e) => e.split("pages/")[1])).toEqual([
        "_app.tsx",
        "index.tsx",
        "[customerId]/index.tsx",
        "faq/[language].tsx",
        "admin/index.tsx",
        "admin/blog/index.tsx",
        "admin/blog/posts.tsx",
        "admin/user/[id].tsx",
        "products/[id].tsx",
        "products/edit.tsx",
        "products/create/index.tsx",
        "products/[category]/index.tsx",
        "products/[category]/theme/current.tsx",
        "products/[category]/theme/new.tsx",
        "products/[category]/theme/color/[colorId].tsx",
      ]);
    });
  });
});
