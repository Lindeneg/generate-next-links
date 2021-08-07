## Generate links to nextjs pages

This program generates a file with a [TypeScript](https://www.typescriptlang.org/) `enum` containing pathnames to all pages in a [next.js](https://nextjs.org/) application.

---

### Getting Started

#### Installing

- How/where to download your program
- Any modifications needed to be made to files/folders

#### Executing program

- How to run the program
- Step-by-step bullets

---

### Description

Suppose we have a next.js application with the following `pages` structure:

```sh
pages
  ├── admin
  │   ├── blog
  │   │   ├── index.tsx
  │   │   └── post.tsx
  │   ├── index.tsx
  │   └── user
  │       └── [id].tsx
  ├── _app.tsx
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
      ├── create
      │   └── index.tsx
      ├── edit.tsx
      └── [id].tsx
```

Then given the above structure, this program will generate a `.ts` file with the following `enum`:

```ts
export enum links {
  ADMIN = "/admin",
  ADMIN_BLOG = "/admin/blog",
  ADMIN_BLOG_POST = "/admin/blog/post",
  ADMIN_USER_ID = "/admin/user/[id]",
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
        pathname: links.PRODUCTS_ID,
        query: { id: props.id },
      }}
    >
  )
}
```
