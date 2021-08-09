## Generate links to nextjs pages

This program generates a file with a [TypeScript](https://www.typescriptlang.org/) `enum` containing pathnames to all pages in a [next.js](https://nextjs.org/) application.

---

### Getting Started

##### Installing

- `npm install -g generate-next-links`
- `generate-next-links [...ARGS]`
- **or**
- `npx generate-next-links [...ARGS]`

##### Options

```sh
Usage: generate-next-links

If no args are specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 --name      Name of generated TypeScript enum
 --path      Path to folder where 'pages' directory resides
 --out       Path where TypeScript file will be written to
 --dry       Perform all operations except writing to disk
 --verbose   Show all log messages in stdout
 --help      Show help
```

---

### Description

Suppose we have a next.js application with the following `pages` structure:

```sh
.
└── pages
    ├── [customerId]
    │   └── index.tsx
    ├── _app.tsx
    ├── admin
    │   ├── blog
    │   │   ├── index.tsx
    │   │   └── posts.tsx
    │   ├── index.tsx
    │   └── user
    │       └── [id].tsx
    ├── faq
    │   └── [language].tsx
    ├── index.tsx
    └── products
        ├── [category]
        │   ├── index.tsx
        │   └── theme
        │       ├── color
        │       │   └── [colorId].tsx
        │       ├── current.tsx
        │       └── new.tsx
        ├── [id].tsx
        ├── create
        │   └── index.tsx
        └── edit.tsx
```

Then given the above structure, this program will generate a `.ts` file with the following `enum`:

```ts
export enum links {
  ADMIN = "/admin",
  ADMIN_BLOG = "/admin/blog",
  ADMIN_BLOG_POSTS = "/admin/blog/posts",
  ADMIN_USER_ID = "/admin/user/[id]",
  CUSTOMER_ID = "/[customerId]",
  FAQ_LANGUAGE = "/faq/[language]",
  PRODUCTS_CATEGORY = "/products/[category]",
  PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID = "/products/[category]/theme/color/[colorId]",
  PRODUCTS_CATEGORY_THEME_CURRENT = "/products/[category]/theme/current",
  PRODUCTS_CATEGORY_THEME_NEW = "/products/[category]/theme/new",
  PRODUCTS_CREATE = "/products/create",
  PRODUCTS_EDIT = "/products/edit",
  PRODUCTS_ID = "/products/[id]",
}
```

The dynamic paths can easily be used in conjunction with [next/link](https://nextjs.org/docs/api-reference/next/link#with-url-object)

```tsx
function component (props) {
  return (
    <Link
      href={{
        pathname: links.PRODUCTS_CATEGORY_THEME_COLOR_COLOR_ID,
        query: {
          category: props.category,
          colorId: props.id
        },
      }}
    >
  )
}
```
