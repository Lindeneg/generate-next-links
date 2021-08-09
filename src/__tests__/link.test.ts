import {
  cleanLinkName,
  convertCamelCase,
  getLinks,
  buildLinkPath,
} from "../link";
import { getTestData } from "./test-util";

describe("Link Test Suite", () => {
  const [nodes, map] = getTestData();
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
    expect(getLinks(nodes, map)).toEqual([
      ["CUSTOMER_ID", "/[customerId]"],
      ["FAQ_LANGUAGE", "/faq/[language]"],
      ["ADMIN", "/admin"],
      ["ADMIN_USER", "/admin/user"],
      ["ADMIN_USER_ID", "/admin/user/[id]"],
      ["ADMIN_BLOG_POSTS", "/admin/blog/posts"],
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
    ["/faq/[language]", nodes[4]],
    ["/admin/user/[id]", nodes[9]],
    ["/admin/blog/posts", nodes[11]],
    ["/products", nodes[12]],
  ])("build link path: %s", (after, before) => {
    expect(buildLinkPath(before, map, nodes)).toBe(after);
  });
});
