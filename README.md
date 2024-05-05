# Lightranet Frontend

<!-- markdownlint-disable-next-line MD033 -->
<img width="400" alt="Logo" src="https://lightit.io/images/Logo_purple.svg" />

We help digital health startups, clinics, and medtech companies ideate, design, and develop custom web & mobile applications that transform the future of healthcare.

This is a monorepo for Light-it's frontend internal projects. A network of Light-it's apps. A lightranet, if you will.

## Recommended Extensions

All of the vscode extensions that we recommend are inside the .vscode/extensions.json

### esbenp.prettier-vscode

Run prettier on your vscode so you can format the code on save and not have to worry ever again about indentation or import order or exactly where and when to break up a gigantic one liner

### dbaeumer.vscode-eslint

Run eslint & typescript on your vscode so you can easily and quickly find out about all of the wonderful mistakes you've just made as soon as you made them

### bradlc.vscode-tailwindcss

Wanna know what a tailwind class name does? with this wonderful extension you can hover over them and find out.

### streetsidesoftware.code-spell-checker

Tired of making mistakes because your english is not exactly perfect? Well boy oh howdy do I have the extension for ya! It's basically eslint but for english.

### eliostruyf.vscode-typescript-exportallmodule

Ever had to create an index file with just a bunch of exports? Ever wondered why don't we automate all of that? Well wonder no more! With this barrel file generator you can generate your barrel files automagically.

## Initiate development environment

1. Install pnpm https://pnpm.io/installation
2. run `pnpm i` to install deps ( or do step 4 and then `pnpm install` on that particular project)
3. enter assignment project `cd apps/assignment`
4. create .env file `cp .env.example .env` and fill with proper variables ( ask team members )
5. run `pnpm run dev` to start dev server

## When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## References

The entire config for this monorepo is 120% based off of [this repo](https://github.com/t3-oss/create-t3-turbo). Please keep an eye on it and maintain this lightranet repo up to date with create-t3-turbo

## Emoji Guide

**For reviewers: Emojis can be added to comments to call out blocking versus non-blocking feedback.**

E.g: Praise, minor suggestions, or clarifying questions that don’t block merging the PR.

> 🟢 Nice refactor!

<!-- markdownlint-disable-line MD028 -->

> 🟡 Why was the default value removed?

E.g: Blocking feedback must be addressed before merging.

> 🔴 This change will break something important

|              |                |                                     |
| ------------ | -------------- | ----------------------------------- |
| Blocking     | 🔴 ❌ 🚨       | RED                                 |
| Non-blocking | 🟡 💡 🤔 💭    | Yellow, thinking, etc               |
| Praise       | 🟢 💚 😍 👍 🙌 | Green, hearts, positive emojis, etc |

## Links

- [Git Flow](https://lightit.slite.com/app/docs/SC8usN2Ju)
- [Handbook of good practices for reviewers in Code Reviews](https://lightit.slite.com/app/docs/ddNGohWthVB3fO)
