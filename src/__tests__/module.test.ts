import { getConfig } from "../config";
import { main } from "../index";

describe("Module test suite", () => {
  test("can execute a dry run", () => {
    const config = getConfig(".", [
      "",
      "",
      "--path",
      "__mock__",
      "--dry",
      "--name",
      "PageLinks",
    ]);
    main(config, (result) => {
      expect(result).toEqual([
        "PageLinks",
        [
          ["ADMIN", "/admin"],
          ["ADMIN_BLOG", "/admin/blog"],
          ["ADMIN_BLOG_POSTS", "/admin/blog/posts"],
          ["ADMIN_USER_ID", "/admin/user/[id]"],
          ["CUSTOMER_ID", "/[customerId]"],
          ["FAQ_LANGUAGE", "/faq/[language]"],
          ["PRODUCTS_CATEGORY", "/products/[category]"],
          [
            "PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID",
            "/products/[category]/theme/color/[colorId]",
          ],
          [
            "PRODUCTS_CATEGORY_THEME_CURRENT",
            "/products/[category]/theme/current",
          ],
          ["PRODUCTS_CATEGORY_THEME_NEW", "/products/[category]/theme/new"],
          ["PRODUCTS_CREATE", "/products/create"],
          ["PRODUCTS_EDIT", "/products/edit"],
          ["PRODUCTS_ID", "/products/[id]"],
        ],
      ]);
    });
  });
});
