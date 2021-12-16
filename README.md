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

Suppose a next.js application with the following `pages` structure:

```
.
└── pages
    ├── 404.tsx
    ├── 500.tsx
    ├── admin
    │   ├── administrate.tsx
    │   ├── index.tsx
    │   └── user
    │       ├── index.tsx
    │       └── options
    │           └── dashboard.tsx
    ├── _app.tsx
    ├── content
    │   ├── [articleId]
    │   │   └── index.tsx
    │   └── index.tsx
    ├── _document.tsx
    ├── index.tsx
    ├── posts
    │   └── [...slug].tsx
    └── user
        └── [[...slug]].tsx
```

_`[...slug]` and `[[...slug]]` are [catch-all-routes](https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes)_

Given the above structure, this program will generate a `.ts` file with the following `enum`:

```ts
export enum links {
  N404 = "/404",
  N500 = "/500",
  ADMIN = "/admin",
  ADMIN_ADMINISTRATE = "/admin/administrate",
  ADMIN_USER = "/admin/user",
  ADMIN_USER_OPTIONS_DASHBOARD = "/admin/user/options/dashboard",
  CONTENT = "/content",
  CONTENT_ARTICLEID = "/content/[articleId]",
  POSTS_CATCHALL_SLUG = "/posts/[...slug]",
  USER_OPTIONAL_CATCHALL_SLUG = "/user/[[...slug]]",
}
```

The dynamic paths can easily be used in conjunction with [next/link](https://nextjs.org/docs/api-reference/next/link#with-url-object)

```tsx
function component (props) {
  return (
    <Link
      href={{
        pathname: links.CONTENT_ARTICLEID,
        query: {
          articleId: props.id
        },
      }}
    >
  )
}
```

Or with another library such as [cl-fill-link]()

```ts
// returns: '/posts/category/music/jazz/miles-davis'
fillLink(links.POSTS_CATCHALL_SLUG, {
  slug: ["category", "music", "jazz", "miles-davis"],
});
```

Suppose the following `api` folder is present in the above example

```
.
└── pages
    ├── api
        ├── article
        │   └── create.ts
        ├── auth
        │   ├── login.ts
        │   └── logout.ts
        └── user
            └── [[...userId]].ts
```

Run the program with the `--api` flag to produce the following:

```ts
export enum links {
  N404 = "/404",
  N500 = "/500",
  ADMIN = "/admin",
  ADMIN_ADMINISTRATE = "/admin/administrate",
  ADMIN_USER = "/admin/user",
  ADMIN_USER_OPTIONS_DASHBOARD = "/admin/user/options/dashboard",
  API_ARTICLE_CREATE = "/api/article/create",
  API_AUTH_LOGIN = "/api/auth/login",
  API_AUTH_LOGOUT = "/api/auth/logout",
  API_USER_OPTIONAL_CATCHALL_USERID = "/api/user/[[...userId]]",
  CONTENT = "/content",
  CONTENT_ARTICLEID = "/content/[articleId]",
  POSTS_CATCHALL_SLUG = "/posts/[...slug]",
  USER_OPTIONAL_CATCHALL_SLUG = "/user/[[...slug]]",
}
```
