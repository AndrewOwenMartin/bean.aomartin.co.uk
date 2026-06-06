Status: ready-for-agent

# PRD: Migrate bean from runtime markdown to MDX

## Problem Statement

`bean` currently loads markdown content as raw strings at runtime using Vite's `import.meta.glob` with `?raw`, then parses and renders them with `react-markdown`. This splits content and components across separate files with no obvious structural connection, adds a runtime parsing step for content that never changes, and makes it awkward to embed interactive components between paragraphs of prose. The concern that motivated this approach — memory impact of text in React — is not a real problem at the scale of an educational website.

## Solution

Replace the runtime markdown loading approach with MDX. MDX compiles markdown to React components at build time via `@mdx-js/rollup`. Each page is a single `.mdx` file that contains both prose (in markdown syntax) and embedded React components. There is no runtime parsing, no glob loading, and no split between content files and assembly files.

## User Stories

1. As a content author, I want to write page content in markdown syntax, so that I don't have to write HTML tags for prose.
2. As a content author, I want to embed React components (such as animations) inline within a page's prose, so that content and interactivity live together in one file.
3. As a developer, I want content to be compiled at build time rather than parsed at runtime, so that there is no unnecessary overhead when the page loads.
4. As a developer, I want to delete the `Page` component and `import.meta.glob` pattern, so that there is one fewer abstraction to understand.
5. As a developer, I want each topic or section to be a single `.mdx` file that `App.tsx` imports directly, so that the relationship between files is explicit.
6. As a developer, I want `react-markdown` removed as a dependency, so that the dependency list accurately reflects what the project uses.
7. As a developer, I want the Vite build to pass after the migration, so that I have confidence nothing is broken.

## Implementation Decisions

- `@mdx-js/rollup` is added as a dev dependency and configured in `vite.config.ts`.
- Existing `.md` files in `bean/markdown/` are converted to `.mdx`. Their content is preserved as-is for now — no content editing in this task.
- `bean/src/page/Page.tsx` is deleted, along with its `import.meta.glob` usage.
- `react-markdown` is removed from `bean/package.json`.
- `App.tsx` is updated to import each MDX file directly as a React component and render it in place of the `<Page>` calls.
- TypeScript types for `.mdx` imports are added (a `*.mdx` declaration) so the compiler does not complain about untyped module imports.
- KaTeX and `react-katex` are retained — mathematical notation is still rendered the same way.

## Testing Decisions

The gate for this task is the build and visual render. `npm run build` in `bean` should pass. The dev server (`npm run dev`) should show the existing content rendering correctly in the browser — same text, same layout, no broken components. No automated tests exist for the website content, and none are needed here.

## Out of Scope

- Editing or improving the content of the existing markdown pages.
- Embedding animations into MDX files — that is part of the animation refactor work. This task only migrates the existing content.
- Migrating `DiffAnim` or other components to use the `sdsjs` library.

## Further Notes

This task is independent of the Swarm `forAll` and npm workspaces tasks and can be done in any order relative to them.

MDX files require a TypeScript declaration to be importable without type errors. A simple `declare module '*.mdx'` in a `.d.ts` file is sufficient for now; it can be tightened later if needed.
