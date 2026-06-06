Status: done

# Migrate bean from runtime markdown to MDX

Replace runtime markdown loading with MDX compiled at build time.

## Acceptance criteria

- `npm run build` in `bean/` passes
- Dev server shows existing content rendering correctly — same text, same layout, no broken components
- `react-markdown` is removed from `bean/package.json`
- `bean/src/page/Page.tsx` is deleted
- `import.meta.glob` usage is gone
- Each page is a `.mdx` file imported directly in `App.tsx`

## Steps

1. Add `@mdx-js/rollup` as a dev dependency in `bean/`
2. Configure the rollup plugin in `bean/vite.config.ts`
3. Add a `*.mdx` TypeScript declaration (e.g. `bean/src/mdx.d.ts`) so the compiler accepts MDX imports
4. Convert each file in `bean/markdown/` from `.md` to `.mdx` — content preserved as-is
5. Update `App.tsx` to import each `.mdx` file directly as a React component and render it in place of `<Page>` calls
6. Delete `bean/src/page/Page.tsx`
7. Remove `react-markdown` from `bean/package.json`
8. Run `npm run build` and confirm it passes

## References

- PRD: `.scratch/bean-mdx-migration/PRD.md`
