import { NodeMap } from "../node";

export const MOCK_API_LINKS_ARRAY = function () {
  return [
    ["API_ARTICLE_GETMANY", "/api/article/get-many"],
    ["API_ARTICLE_GETSINGLE", "/api/article/get-single"],
    ["API_LOGIN", "/api/login"],
    ["API_SIGNUP", "/api/signup"],
  ];
};

export const MOCK_LINKS_ARRAY = function (API_LINKS: string[][] = []) {
  return [
    ["400", "/400"],
    ["42_ANSWER", "/42/answer"],
    ["500", "/500"],
    ["ADMIN", "/admin"],
    ["ADMIN_BLOG", "/admin/blog"],
    ["ADMIN_BLOG_POSTS", "/admin/blog/posts"],
    ["ADMIN_USER_ID", "/admin/user/[id]"],
    ...API_LINKS,
    ["CATCHALL_MILES", "/[...miles]"],
    ["CUSTOMER_ID", "/[customerId]"],
    ["FAQ_LANGUAGE", "/faq/[language]"],
    ["OPTIONAL_CATCHALL_DAVIS", "/[[...davis]]"],
    ["POSTALT_OPTIONAL_CATCHALL_SLUG", "/post-alt/[[...slug]]"],
    ["POST_CATCHALL_SLUG", "/post/[...slug]"],
    ["PRODUCTS_CATEGORY", "/products/[category]"],
    [
      "PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID",
      "/products/[category]/theme/color/[colorId]",
    ],
    ["PRODUCTS_CATEGORY_THEME_CURRENT", "/products/[category]/theme/current"],
    ["PRODUCTS_CATEGORY_THEME_NEW", "/products/[category]/theme/new"],
    ["PRODUCTS_CREATE", "/products/create"],
    ["PRODUCTS_EDIT", "/products/edit"],
    ["PRODUCTS_ID", "/products/[id]"],
  ];
};

export const MOCK_NODE_MAP = function (): NodeMap {
  const testMap = new NodeMap();
  [
    [{ name: "/", isDir: true, parentId: null }],
    [{ name: "[customerId]", isDir: true, parentId: 0 }],
    [{ name: "", isDir: false, parentId: 1 }],
    [{ name: "faq", isDir: true, parentId: 0 }],
    [{ name: "[language]", isDir: false, parentId: 3 }],
    [{ name: "admin", isDir: true, parentId: 0 }],
    [{ name: "", isDir: false, parentId: 5 }],
    [{ name: "blog", isDir: true, parentId: 5 }],
    [{ name: "", isDir: false, parentId: 7 }],
    [{ name: "posts", isDir: false, parentId: 7 }],
    [{ name: "user", isDir: true, parentId: 5 }],
    [{ name: "[id]", isDir: false, parentId: 10 }],
    [{ name: "products", isDir: true, parentId: 0 }],
    [{ name: "[id]", isDir: false, parentId: 12 }],
    [{ name: "edit", isDir: false, parentId: 12 }],
    [{ name: "create", isDir: true, parentId: 12 }],
    [{ name: "", isDir: false, parentId: 15 }],
    [{ name: "[category]", isDir: true, parentId: 12 }],
    [{ name: "", isDir: false, parentId: 17 }],
    [{ name: "theme", isDir: true, parentId: 17 }],
    [{ name: "current", isDir: false, parentId: 19 }],
    [{ name: "new", isDir: false, parentId: 19 }],
    [{ name: "color", isDir: true, parentId: 19 }],
    [{ name: "[colorId]", isDir: false, parentId: 22 }],
  ].forEach((entry) => {
    testMap.setNode(entry[0]);
  });
  return testMap;
};
