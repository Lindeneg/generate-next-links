import { getLink, cleanLinkName } from "../link";

test.each([
  ["/admin/edit/blog/[articleId]", "ADMIN_EDIT_BLOG_ARTICLEID"],
  ["/admin/edit/[slug]/[id]", "ADMIN_EDIT_SLUG_ID"],
  ["admin/user/[id]", "ADMIN_USER_ID"],
  ["admin/music/artist/[artistId]", "ADMIN_MUSIC_ARTIST_ARTISTID"],
])("clean: %s => %s", (dirtyLink, cleanLink) => {
  expect(cleanLinkName(dirtyLink)).toBe(cleanLink);
});

test.each([
  [
    "/admin/edit/blog/[articleId].tsx",
    "/admin/edit/blog/[articleId]",
    "ADMIN_EDIT_BLOG_ARTICLEID",
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
    "ADMIN_MUSIC_ARTIST_ARTISTID",
  ],
])("link: %s => %s", (rawLink, link, name) => {
  expect(getLink(rawLink)).toEqual([name, link]);
});
