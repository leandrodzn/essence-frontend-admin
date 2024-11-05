# Essence Creatives Frontend for Administrators

Essence Creatives for Administrators is a client web software to help administrators of Essence Creatives customers website to manage the products and requests for Essence Creatives company.

This README should help get you started developing with Vue 3 in Vite.

## Table of contents

- [Essence Creatives Frontend for Administrators](#essence-creatives-frontend-for-administrators)
  - [Table of contents](#table-of-contents)
  - [Run Locally](#run-locally)
    - [Clone the project](#clone-the-project)
    - [Go to the project directory](#go-to-the-project-directory)
    - [Create and change to local branch develop](#create-and-change-to-local-branch-develop)
    - [Pull changes of develop branch](#pull-changes-of-develop-branch)
    - [Create and move to your own develop branch](#create-and-move-to-your-own-develop-branch)
    - [Create .env file](#create-env-file)
    - [Install dependencies](#install-dependencies)
    - [Run project with Hot-Reload for Development](#run-project-with-hot-reload-for-development)
    - [Push your branch](#push-your-branch)
      - [Don't forget to set your global profile in Git](#dont-forget-to-set-your-global-profile-in-git)
  - [Recommended IDE Setup](#recommended-ide-setup)
  - [Type Support for `.vue` Imports in TS](#type-support-for-vue-imports-in-ts)
    - [Type-Check, Compile and Minify for Production](#type-check-compile-and-minify-for-production)
    - [Run Unit Tests with Vitest](#run-unit-tests-with-vitest)
    - [Lint with ESLint](#lint-with-eslint)
  - [Authors](#authors)
  - [Build with](#build-with)

## Run Locally

### Clone the project

bash

```sh
  git clone https://github.com/leandrodzn/essence-frontend-admin.git
```

### Go to the project directory

bash

```sh
  cd essence-frontend-admin
```

### Create and change to local branch develop

bash

```sh
  git checkout -b develop
```

### Pull changes of develop branch

bash

```sh
  git pull origin develop
```

### Create and move to your own develop branch

bash

```sh
  git checkout -b name/develop // example: leandro/develop, wilder/develop
```

### Create .env file

Variables

```bash

VITE_APP_API_BACKEND=

```

### Install dependencies

bash

```sh
  npm install
```

### Run project with Hot-Reload for Development

bash

```sh
  npm run dev
```

### Push your branch

bash

```sh
  git push origin name/develop
```

#### Don't forget to set your global profile in Git

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Authors

- **Domingo Emmanuel Ciau Uc**

  - [![GitHub](https://img.shields.io/badge/GitHub-EmanuelCiau-red?style=flat&logo=github)](https://github.com/EmanuelCiau)

- **María Belen Couoh Chan**

  - [![GitHub](https://img.shields.io/badge/GitHub-Belen2708-pink?style=flat&logo=github)](https://github.com/Belen2708)

- **Leandro Angel Dzib Nauat**
  - [![GitHub](https://img.shields.io/badge/GitHub-leandrodzn-green?style=flat&logo=github)](https://github.com/leandrodzn)

## Build with

- [NodeJs](https://nodejs.org/es) - Server runtime environment Version (^ v20.11.0)
- [Vue 3](https://vuejs.org/) - An approachable, performant and versatile framework for building web user interfaces.
