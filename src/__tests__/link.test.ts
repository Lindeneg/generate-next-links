import { getConfig } from "../config";
import {
  cleanLinkName,
  convertCamelCase,
  getLinks,
  buildLinkPath,
  generateLinkNodeTree,
} from "../link";
import { MOCK_NODE_MAP } from "./test-util";

describe("Link Test Suite", () => {
  const nodeMap = MOCK_NODE_MAP();
  test.each([
    ["/admin/edit/blog/[articleId]", "ADMIN_EDIT_BLOG_ARTICLE_ID"],
    ["/admin/edit/[slug]/[id]", "ADMIN_EDIT_SLUG_ID"],
    ["admin/user/[id]", "ADMIN_USER_ID"],
    ["admin/music/artist/[artistId]", "ADMIN_MUSIC_ARTIST_ARTIST_ID"],
  ])("clean: %s , %s", (dirtyLink, cleanLink) => {
    expect(cleanLinkName(dirtyLink)).toBe(cleanLink);
  });

  test.each([
    ["admin/edit/blog/[articleId]", "Admin/edit/blog/[article_Id]"],
    ["admin/music/artist/[artistId]", "Admin/music/artist/[artist_Id]"],
    [
      "adminRoute/music/artist/[artistId]",
      "Admin_Route/music/artist/[artist_Id]",
    ],
  ])("convert: %s , %s", (before, after) => {
    expect(convertCamelCase(before)).toBe(after);
  });

  test("can generate links from nodes and map", () => {
    expect(getLinks(nodeMap)).toEqual([
      ["CUSTOMER_ID", "/[customerId]"],
      ["FAQ_LANGUAGE", "/faq/[language]"],
      ["ADMIN", "/admin"],
      ["ADMIN_BLOG", "/admin/blog"],
      ["ADMIN_BLOG_POSTS", "/admin/blog/posts"],
      ["ADMIN_USER_ID", "/admin/user/[id]"],
      ["PRODUCTS_ID", "/products/[id]"],
      ["PRODUCTS_EDIT", "/products/edit"],
      ["PRODUCTS_CREATE", "/products/create"],
      ["PRODUCTS_CATEGORY", "/products/[category]"],
      ["PRODUCTS_CATEGORY_THEME_CURRENT", "/products/[category]/theme/current"],
      ["PRODUCTS_CATEGORY_THEME_NEW", "/products/[category]/theme/new"],
      [
        "PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID",
        "/products/[category]/theme/color/[colorId]",
      ],
    ]);
  });
  test.each([
    ["current", "/[customerId]", 1],
    ["user", "/admin/user", 10],
    ["create", "/products/create", 15],
    ["current", "/products/[category]/theme/current", 20],
  ])("build link path: %s => %s", (_, expected, id) => {
    expect(buildLinkPath(nodeMap.getNode(id), nodeMap)).toBe(expected);
  });
  test("can generate nodemap from __mock__ directory", (done) => {
    generateLinkNodeTree(
      getConfig("./__mock__", ["", "", "--dry"]),
      (predictedNodeMap) => {
        expect(predictedNodeMap.size).toEqual(nodeMap.size);
        done();
      }
    );
  });
});
