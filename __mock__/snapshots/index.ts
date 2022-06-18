/* eslint-disable max-len */
export const tsApiSnapshot = `
"export enum blinks {
    ADMIN = '/admin',
    ADMIN_BLOG = '/admin/blog',
    ADMIN_BLOG_POSTS = '/admin/blog/posts',
    ADMIN_USER_ID = '/admin/user/[id]',
    API_ARTICLE_GET_MANY = '/api/article/get-many',
    API_ARTICLE_GET_SINGLE = '/api/article/get-single',
    API_LOGIN = '/api/login',
    API_SIGNUP = '/api/signup',
    CATCHALL_MILES = '/[...miles]',
    CUSTOMER_ID = '/[customerId]',
    FAQ_LANGUAGE = '/faq/[language]',
    N400 = '/400',
    N42_ANSWER = '/42/answer',
    N500 = '/500',
    OPTIONAL_CATCHALL_DAVIS = '/[[...davis]]',
    POST_ALT_OPTIONAL_CATCHALL_SLUG = '/post-alt/[[...slug]]',
    POST_CATCHALL_SLUG = '/post/[...slug]',
    PRODUCTS_CATEGORY = '/products/[category]',
    PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID = '/products/[category]/theme/color/[colorId]',
    PRODUCTS_CATEGORY_THEME_CURRENT = '/products/[category]/theme/current',
    PRODUCTS_CATEGORY_THEME_NEW = '/products/[category]/theme/new',
    PRODUCTS_CREATE = '/products/create',
    PRODUCTS_EDIT = '/products/edit',
    PRODUCTS_ID = '/products/[id]',
}
"
`;

export const tsNonApiSnapshot = `
"export enum alinks {
    ADMIN = '/admin',
    ADMIN_BLOG = '/admin/blog',
    ADMIN_BLOG_POSTS = '/admin/blog/posts',
    ADMIN_USER_ID = '/admin/user/[id]',
    CATCHALL_MILES = '/[...miles]',
    CUSTOMER_ID = '/[customerId]',
    FAQ_LANGUAGE = '/faq/[language]',
    N400 = '/400',
    N42_ANSWER = '/42/answer',
    N500 = '/500',
    OPTIONAL_CATCHALL_DAVIS = '/[[...davis]]',
    POST_ALT_OPTIONAL_CATCHALL_SLUG = '/post-alt/[[...slug]]',
    POST_CATCHALL_SLUG = '/post/[...slug]',
    PRODUCTS_CATEGORY = '/products/[category]',
    PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID = '/products/[category]/theme/color/[colorId]',
    PRODUCTS_CATEGORY_THEME_CURRENT = '/products/[category]/theme/current',
    PRODUCTS_CATEGORY_THEME_NEW = '/products/[category]/theme/new',
    PRODUCTS_CREATE = '/products/create',
    PRODUCTS_EDIT = '/products/edit',
    PRODUCTS_ID = '/products/[id]',
}
"
`;

export const tsRootBaseSnapshot = `
"export enum elinks {
    SOME_BASE_400 = '/some/base/400',
    SOME_BASE_42_ANSWER = '/some/base/42/answer',
    SOME_BASE_500 = '/some/base/500',
    SOME_BASE_ADMIN = '/some/base/admin',
    SOME_BASE_ADMIN_BLOG = '/some/base/admin/blog',
    SOME_BASE_ADMIN_BLOG_POSTS = '/some/base/admin/blog/posts',
    SOME_BASE_ADMIN_USER_ID = '/some/base/admin/user/[id]',
    SOME_BASE_CATCHALL_MILES = '/some/base/[...miles]',
    SOME_BASE_CUSTOMER_ID = '/some/base/[customerId]',
    SOME_BASE_FAQ_LANGUAGE = '/some/base/faq/[language]',
    SOME_BASE_OPTIONAL_CATCHALL_DAVIS = '/some/base/[[...davis]]',
    SOME_BASE_POST_ALT_OPTIONAL_CATCHALL_SLUG = '/some/base/post-alt/[[...slug]]',
    SOME_BASE_POST_CATCHALL_SLUG = '/some/base/post/[...slug]',
    SOME_BASE_PRODUCTS_CATEGORY = '/some/base/products/[category]',
    SOME_BASE_PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID = '/some/base/products/[category]/theme/color/[colorId]',
    SOME_BASE_PRODUCTS_CATEGORY_THEME_CURRENT = '/some/base/products/[category]/theme/current',
    SOME_BASE_PRODUCTS_CATEGORY_THEME_NEW = '/some/base/products/[category]/theme/new',
    SOME_BASE_PRODUCTS_CREATE = '/some/base/products/create',
    SOME_BASE_PRODUCTS_EDIT = '/some/base/products/edit',
    SOME_BASE_PRODUCTS_ID = '/some/base/products/[id]',
    SOME_BASE_ROOT = '/some/base',
}
"
`;

export const jsonNonApiSnapshot = `
"{
    \\"ADMIN\\": \\"/admin\\",
    \\"ADMIN_BLOG\\": \\"/admin/blog\\",
    \\"ADMIN_BLOG_POSTS\\": \\"/admin/blog/posts\\",
    \\"ADMIN_USER_ID\\": \\"/admin/user/[id]\\",
    \\"CATCHALL_MILES\\": \\"/[...miles]\\",
    \\"CUSTOMER_ID\\": \\"/[customerId]\\",
    \\"FAQ_LANGUAGE\\": \\"/faq/[language]\\",
    \\"N400\\": \\"/400\\",
    \\"N42_ANSWER\\": \\"/42/answer\\",
    \\"N500\\": \\"/500\\",
    \\"OPTIONAL_CATCHALL_DAVIS\\": \\"/[[...davis]]\\",
    \\"POST_ALT_OPTIONAL_CATCHALL_SLUG\\": \\"/post-alt/[[...slug]]\\",
    \\"POST_CATCHALL_SLUG\\": \\"/post/[...slug]\\",
    \\"PRODUCTS_CATEGORY\\": \\"/products/[category]\\",
    \\"PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID\\": \\"/products/[category]/theme/color/[colorId]\\",
    \\"PRODUCTS_CATEGORY_THEME_CURRENT\\": \\"/products/[category]/theme/current\\",
    \\"PRODUCTS_CATEGORY_THEME_NEW\\": \\"/products/[category]/theme/new\\",
    \\"PRODUCTS_CREATE\\": \\"/products/create\\",
    \\"PRODUCTS_EDIT\\": \\"/products/edit\\",
    \\"PRODUCTS_ID\\": \\"/products/[id]\\"
}
"
`;

export const jsonApiSnapshot = `
"{
    \\"ADMIN\\": \\"/admin\\",
    \\"ADMIN_BLOG\\": \\"/admin/blog\\",
    \\"ADMIN_BLOG_POSTS\\": \\"/admin/blog/posts\\",
    \\"ADMIN_USER_ID\\": \\"/admin/user/[id]\\",
    \\"API_ARTICLE_GET_MANY\\": \\"/api/article/get-many\\",
    \\"API_ARTICLE_GET_SINGLE\\": \\"/api/article/get-single\\",
    \\"API_LOGIN\\": \\"/api/login\\",
    \\"API_SIGNUP\\": \\"/api/signup\\",
    \\"CATCHALL_MILES\\": \\"/[...miles]\\",
    \\"CUSTOMER_ID\\": \\"/[customerId]\\",
    \\"FAQ_LANGUAGE\\": \\"/faq/[language]\\",
    \\"N400\\": \\"/400\\",
    \\"N42_ANSWER\\": \\"/42/answer\\",
    \\"N500\\": \\"/500\\",
    \\"OPTIONAL_CATCHALL_DAVIS\\": \\"/[[...davis]]\\",
    \\"POST_ALT_OPTIONAL_CATCHALL_SLUG\\": \\"/post-alt/[[...slug]]\\",
    \\"POST_CATCHALL_SLUG\\": \\"/post/[...slug]\\",
    \\"PRODUCTS_CATEGORY\\": \\"/products/[category]\\",
    \\"PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID\\": \\"/products/[category]/theme/color/[colorId]\\",
    \\"PRODUCTS_CATEGORY_THEME_CURRENT\\": \\"/products/[category]/theme/current\\",
    \\"PRODUCTS_CATEGORY_THEME_NEW\\": \\"/products/[category]/theme/new\\",
    \\"PRODUCTS_CREATE\\": \\"/products/create\\",
    \\"PRODUCTS_EDIT\\": \\"/products/edit\\",
    \\"PRODUCTS_ID\\": \\"/products/[id]\\"
}
"
`;
