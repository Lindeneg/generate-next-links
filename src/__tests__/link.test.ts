import { getLink, cleanLinkName, convertCamelCase } from "../link";

describe("Link Test Suite", () => {
  test.each([
    ["/admin/edit/blog/[articleId]", "ADMIN_EDIT_BLOG_ARTICLE_ID"],
    ["/admin/edit/[slug]/[id]", "ADMIN_EDIT_SLUG_ID"],
    ["admin/user/[id]", "ADMIN_USER_ID"],
    ["admin/music/artist/[artistId]", "ADMIN_MUSIC_ARTIST_ARTIST_ID"],
  ])("clean: %s => %s", (dirtyLink, cleanLink) => {
    expect(cleanLinkName(dirtyLink)).toBe(cleanLink);
  });

  test.each([
    ["admin/edit/blog/[articleId]", "Admin/edit/blog/[article_Id]"],
    ["admin/music/artist/[artistId]", "Admin/music/artist/[artist_Id]"],
    [
      "adminRoute/music/artist/[artistId]",
      "Admin_Route/music/artist/[artist_Id]",
    ],
  ])("convert: %s => %s", (before, after) => {
    expect(convertCamelCase(before)).toBe(after);
  });

  test.each([
    [
      "/admin/edit/blog/[articleId].tsx",
      "/admin/edit/blog/[articleId]",
      "ADMIN_EDIT_BLOG_ARTICLE_ID",
    ],
    [
      "/admin/edit/[slug]/[id]/index.tsx",
      "/admin/edit/[slug]/[id]",
      "ADMIN_EDIT_SLUG_ID",
    ],
    ["admin/user/[id]/index.tsx", "/admin/user/[id]", "ADMIN_USER_ID"],
    [
      "admin/music/artist/[artistId].tsx",
      "/admin/music/artist/[artistId]",
      "ADMIN_MUSIC_ARTIST_ARTIST_ID",
    ],
  ])("link: %s => %s", (rawLink, link, name) => {
    expect(getLink(rawLink)).toEqual([name, link]);
  });
});
