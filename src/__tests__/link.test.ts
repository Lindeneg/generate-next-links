import {
  cleanLinkName,
  convertCamelCase,
  getLinks,
  buildLinkPath,
} from "../link";

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

describe("Link Test Suite", () => {
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
    expect(getLinks(testNodes, testMap)).toEqual([
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
    ["/faq/[language]", testNodes[4]],
    ["/admin/blog", testNodes[9]],
    ["/admin/blog/posts", testNodes[11]],
    ["/products", testNodes[12]],
  ])("build link path: %s", (after, before) => {
    expect(buildLinkPath(before, testMap, testNodes)).toBe(after);
  });
});
