# Publishing a Professional npm Package (10 steps)

## 1) Create a project folder

```bash
mkdir my-lib
cd my-lib
npm init -y
```

## 2) Fill in `package.json` (professional metadata)

At minimum, include:
- `name`, `version`, `description`
- `license` and a real `LICENSE` file
- `keywords`
- `repository`, `homepage`, `bugs`

Example:

```json
{
  "name": "my-lib",
  "version": "0.1.0",
  "description": "One-line description of what it does.",
  "license": "MIT",
  "keywords": ["react", "component", "form"],
  "repository": { "type": "git", "url": "git+https://github.com/you/my-lib.git" },
  "homepage": "https://github.com/you/my-lib#readme",
  "bugs": { "url": "https://github.com/you/my-lib/issues" }
}
```

## 3) Create the entry file people import from

Create `src/index.ts` (or `src/index.js`) and export your public API:

```ts
export { Questionnaire } from "./Questionnaire";
export type { QuestionnaireConfig } from "./types";
```

## 4) Build to `dist/`

For TypeScript libraries, a common simple setup is `tsup`.

```bash
npm i -D tsup typescript
```

Add a build script:

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  }
}
```

Run it:

```bash
npm run build
```

You should end up with files like:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CJS)
- `dist/index.d.ts` (types)

## 5) Add `main` / `exports` / `types`

This makes installs/imports work reliably in modern bundlers and Node.

Example:

```json
{
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 6) Write a good `README.md`

Include:
- Install command
- Quick start example
- API/props summary
- License

Example snippet:

```md
## Install
npm i my-lib

## Usage
import { Questionnaire } from "my-lib";
```

## 7) Whitelist what gets published

Prefer an allowlist using `files` in `package.json`:

```json
{
  "files": ["dist", "README.md", "LICENSE"]
}
```

If you do this, `.npmignore` is usually unnecessary.

## 8) Add a `LICENSE` file (if you claim a license)

If `package.json` says `"license": "MIT"`, include a real `LICENSE` file containing the MIT text.

## 9) Test the exact publish output locally

```bash
npm pack
```

This creates a `.tgz` file. Inspect it to confirm it includes only what you expect (usually `dist/`, `README.md`, `LICENSE`, `package.json`).

## 10) Log in and publish

```bash
npm login
npm publish
```

Tip: add a safety script so publishing always builds first:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```
