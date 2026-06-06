# bean — Domain Context

## Purpose

An educational website introducing Stochastic Diffusion Search (SDS) to a BSc-level audience. Hosted at bean.aomartin.co.uk. The site demonstrates the `sdsjs` library — it imports `sdsjs` as a local npm workspace dependency and does not reimplement any SDS logic itself.

## Content Structure

**Introduction** — a linear narrative that teaches the algorithm from scratch:
- What is a swarm, a hypothesis, active vs inactive
- The diffusion phase and the test phase
- The D/T/I/H loop

**Topic hub** — after the introduction, an index of self-contained topic branches that can be read in any order:
- Mathematical modelling (convergence, steady state, robustness)
- Philosophy of swarm intelligence
- Applying SDS to classic problems
- Where SDS is and isn't a good fit

Each topic branch corresponds to a variant or concept from the `sdsjs` library.

## Content Authoring

Pages are written as **MDX** (`.mdx` files). MDX compiles to React components at build time, allowing markdown prose with React components embedded inline:

```mdx
In the diffusion phase, inactive agents poll a random peer...

<DiffAnim />

If the polled agent is active, the inactive agent copies its hypothesis...
```

The old approach (loading raw `.md` files at runtime via `import.meta.glob` and rendering with `react-markdown`) is replaced by MDX. The `Page` component and `pages` glob are removed.

## Animations

Two categories:

**Individual behaviour** — show a small number of agents as visible entities (coloured dots, icons) stepping through D or T phase interactions one agent at a time. Used to teach the mechanism. These call library functions (e.g. `DPassive`) directly and hold swarm state in React state.

**Global behaviour** — line charts showing emergent properties over many iterations (cluster size, convergence, active agent count). These run the library to completion and plot results.

Animations are separate purpose-built components — not a single configurable widget. Shared utilities (if any emerge) live in `src/animation/`. The library drives the logic; animations only handle presentation.

## Tech Decisions

- **MDX** via `@mdx-js/rollup` for content authoring
- **KaTeX** / `react-katex` for mathematical notation
- **sdsjs** imported as npm workspace dependency — no local SDS reimplementation
- No `react-markdown` or `import.meta.glob` raw markdown loading
