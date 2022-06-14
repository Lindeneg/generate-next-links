export const tsApiSnapshot = `
"export enum withlinks {
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
"export enum withoutlinks {
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
