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
      ["ADMIN_USER_ID", "/admin/user/[id]"],
      ["ADMIN_BLOG", "/admin/blog"],
      ["ADMIN_BLOG_POSTS", "/admin/blog/posts"],
      ["PRODUCTS", "/products"],
    ]);
  });

  test.each([
    ["/faq/[language]", nodes[4]],
    ["/admin/blog", nodes[9]],
    ["/admin/blog/posts", nodes[11]],
    ["/products", nodes[12]],
  ])("build link path: %s", (after, before) => {
    expect(buildLinkPath(before, map, nodes)).toBe(after);
  });
});
