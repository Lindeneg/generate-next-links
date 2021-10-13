## Generate links to nextjs pages

This program generates a file with a [TypeScript](https://www.typescriptlang.org/) `enum` containing pathnames to all pages in a [next.js](https://nextjs.org/) application.

---

### Getting Started

##### Installing

- `npm install -g generate-next-links`
- `generate-next-links [...ARGS]`
- **or**
- `npx generate-next-links@latest [...ARGS]`

##### Options

```
Usage: generate-next-links

If no 'path' is specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 -N --name [NAME]         name of generated TypeScript enum
 -P --path [PATH]         path to folder where 'pages' directory resides
 -O --out  [PATH]         path to folder where ts file will be written to
 -B --base [PATH]         custom base path, defaults to '/'
 -A --api                 include API paths found in '/pages/api' folder
 -R --root                include an 'INDEX' entry with path '/'
 -D --dry                 perform all operations except writing to disk
 -V --verbose             show all log messages in stdout
 -T --omit-timestamp      omit timestamp from written ts file
 -J --export-json         export json instead of ts enum
 -C --convert-camel-case  convert camel case to be delimited by underscore
 -I --version             show current version
 -H --help                show help
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
  CUSTOMERID = "/[customerId]",
  FAQ_LANGUAGE = "/faq/[language]",
  PRODUCTS_CATEGORY = "/products/[category]",
  PRODUCTS_CATEGORY_THEME_COLOR_COLORID = "/products/[category]/theme/color/[colorId]",
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
        pathname: links.PRODUCTS_CATEGORY_THEME_COLOR_COLORID,
        query: {
          category: props.category,
          colorId: props.id
        },
      }}
    >
  )
}
```

Note that `json` is also supported. The above structure would yield the following `.json` file:

```json
{
  "ADMIN": "/admin",
  "ADMIN_BLOG": "/admin/blog",
  "ADMIN_BLOG_POSTS": "/admin/blog/posts",
  "ADMIN_USER_ID": "/admin/user/[id]",
  "CUSTOMERID": "/[customerId]",
  "FAQ_LANGUAGE": "/faq/[language]",
  "PRODUCTS_CATEGORY": "/products/[category]",
  "PRODUCTS_CATEGORY_THEME_COLOR_COLORID": "/products/[category]/theme/color/[colorId]",
  "PRODUCTS_CATEGORY_THEME_CURRENT": "/products/[category]/theme/current",
  "PRODUCTS_CATEGORY_THEME_NEW": "/products/[category]/theme/new",
  "PRODUCTS_CREATE": "/products/create",
  "PRODUCTS_EDIT": "/products/edit",
  "PRODUCTS_ID": "/products/[id]"
}
```
