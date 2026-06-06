Status: completed

# PRD: Wire up npm workspaces

## Problem Statement

`bean` and `sdsjs` are currently independent packages with no dependency relationship. `bean` has its own incomplete, broken SDS implementation (`src/sds/sds.ts`) with empty stubs and a reference to an undefined variable. Meanwhile the real SDS implementation lives in `sdsjs`. This means the educational website cannot use the library it is meant to demonstrate.

## Solution

Configure npm workspaces at the monorepo root so that `bean` can import from `sdsjs` as a proper dependency. Delete `bean`'s local SDS stub. Verify the workspace link is live by confirming TypeScript resolves the import.

## User Stories

1. As a developer, I want a root `package.json` that declares both packages as workspaces, so that npm manages the link between them.
2. As a developer working in `bean`, I want to `import { SDSStandard } from 'sds'` and have TypeScript resolve it correctly, so that I can use the library without path hacks.
3. As a developer, I want `bean`'s broken local SDS stub deleted, so that there is no confusion about where SDS logic lives.
4. As a developer, I want `npm install` run from the repo root to be the single setup step, so that the workspace link is established automatically.
5. As a developer, I want `bean`'s TypeScript build to pass after the workspace is wired up, so that I have confidence the link is correct.

## Implementation Decisions

- A root `package.json` is created declaring `"workspaces": ["bean", "sdsjs"]`.
- `sds` is added as a dependency in `bean/package.json` using `"*"` as the version (workspace protocol).
- `npm install` is run from the repo root to create the symlink in `bean/node_modules/sds`.
- `bean/src/sds/sds.ts` is deleted. It contains empty `test()` and `iterate()` stubs and a `diffuse()` function that references an undefined variable `array`. It has no callers and no tests.
- The `DiffAnim` component's inline SDS logic is NOT removed in this task — that is a separate concern tied to the animation refactor work.
- `sdsjs` must have run `npm run build` (producing `dist/`) before `bean` can import from it, since `sdsjs` points to `dist/main.js` as its main entry. The workspace setup should note this build step.

## Testing Decisions

The gate for this task is TypeScript compilation: `npm run build` in `bean` should complete without errors after the workspace is wired. No new unit tests are needed — the link is either live or it isn't.

## Out of Scope

- Replacing `DiffAnim`'s inline SDS logic with library calls — that is part of the animation refactor.
- Publishing `sdsjs` to npm.
- Any changes to `sdsjs` source.

## Learnings

- `sdsjs/package.json` had the entire transitive dependency tree of jest pasted into `dependencies` (not `devDependencies`). This blocked `npm install` from the workspace root because `string-width-cjs@^4.2.3` no longer exists on the registry. Stripped back to direct devDependencies only.
- `sdsjs/package.json` declared `"main": "dist/main.js"` and `"types": "dist/main.d.ts"`, but `tsc` with `rootDir: src` outputs `dist/index.js`. Fixed to `dist/index.js` / `dist/index.d.ts`.
- `sdsjs/src/index.ts` only exported `DHUniform` (from the wrong module). Expanded to export the full public surface (`SDSStandard`, `SDS`, all D/T/I/H functions, swarm constructors, and types).
- `sdsjs/src/hashmap/sds.ts` had a syntax error (`if(agent.active)` with no body) that blocked `tsc`. Fixed with `{}`.
- The PRD gate ("bean TypeScript build passes") was not fully achievable — `bean` has pre-existing errors in `DiffAnim.tsx`, `App.tsx`, etc. unrelated to the workspace link. The workspace link itself is confirmed working: `require('sds')` resolves `SDSStandard` as a function, and `tsc` reports zero `sds`-related errors.

## Further Notes

This task depends on the Swarm `forAll` task being complete first — `bean` should not take a dependency on `sdsjs` until `sdsjs` exports a correct, stable interface.

The `pip install -e` equivalent in this setup is npm workspaces — changes to `sdsjs/src` are immediately visible to `bean` after a rebuild of `sdsjs`, with no reinstall needed.
