# SDS mathematical analysis workspace

This directory extends the mathematical analysis in `thesis/003.2-mathematical-analysis-of-sds.md`
(the Discrete Dynamical Systems Model, DDSM, of standard SDS) to the variants catalogued in
`thesis/003.4-variants-of-sds.md`. The goal is to derive, for each variant, the same class of
results already known for standard SDS: a one-step evolution function, minimum convergence
criterion (α_min), robustness (ζ), steady state (γ), and convergence time, where they can be
meaningfully defined for that variant.

## Files

- `standard-sds-summary.md` — clean restatement of the DDSM results for standard SDS (from
  thesis 3.2), used as the baseline every variant is compared against.
- `variants-catalog.md` — every variant from thesis 3.4, with what's already derived and what
  isn't. This is the worklist.
- `python/` — sympy-based symbolic derivation scratchwork, one file per variant, plus shared
  helpers for the standard-SDS baseline.

## Output

Finished derivations get written up as MDX for the bean website, following the pattern started
in `bean/markdown/ddsm.mdx` (mixes markdown, inline/block LaTeX via `react-katex`, and can embed
React components for interactive figures). One MDX file per variant, mirroring the structure of
`ddsm.mdx`.

## Workflow

1. Pick a variant from `variants-catalog.md`.
2. Work the derivation in `python/variants/<variant>.py` using sympy to keep algebra correct and
   check limiting cases (e.g. recovers standard SDS when the variant's extra parameter is 0).
3. Update `variants-catalog.md` with the result status.
4. Write up the result as `bean/markdown/<variant>.mdx`.

No derivations have been started yet — this commit is scaffolding only.
