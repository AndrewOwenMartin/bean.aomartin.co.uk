# bean content ideas

## Foundation / Mechanics

- What is a search problem? — motivate SDS before introducing it; contrast with exhaustive search, binary search, random sampling
- The hypothesis space — visual: N agents sitting on a number line (or grid), each pointing at a position
- Active vs inactive — interactive: click to flip agents happy/sad; build the intuition before any math
- The test phase — TestAnim to complement DiffAnim; show an agent probing its hypothesis and flipping state
- One full iteration — D then T as a single animated step; watch the swarm change
- The D/T/I/H loop — diagram of the four-function taxonomy; make the structure of the algorithm explicit

## Global Behaviour / Charts

- Convergence over time — line chart: active agent count per iteration; show it climbing toward steady state
- Cluster formation — show clusters nucleating, merging, smaller ones dying
- Steady state — what the chart looks like when it stabilises; link to γ formula
- Parameter explorer — sliders for α (test quality), β (search space size), N (swarm size); watch the chart change live

## Variants

- Context-free SDS — what changes in D, animation, when to use it
- Context-sensitive SDS — what changes, tradeoffs vs context-free
- Side-by-side variant comparison — same problem, three diffusion strategies, watch the difference
- Reducing SDS — novel halting mechanism from the thesis
- Running-mean SDS — non-boolean test; animated
- Quorum sensing SDS — what quorum sensing is biologically, then the SDS version

## Mathematics

- Deriving c̄ᵢ₊₁ — step through the one-step evolution function in prose + KaTeX
- What is robustness? — explain ζ ≈ 0.614; visualise what happens at the boundary
- Minimum convergence criteria — α_min and why it matters; what happens below it (animated failure case)
- Phase transition — bifurcation: above/below α_min as a visual flip
- Steady state γ — what fraction of agents end up active; derive and animate

## Applications

- 2D landscape search — heatmap with agents; SDS finds the peak
- Pattern matching — SDS searching an image for a feature patch
- Dynamic environments — the best answer shifts mid-run; show the swarm tracking it
- Multi-modal search — two equally strong peaks; watch the swarm split or collapse
- Race: SDS vs random vs exhaustive — same problem, animated head-to-head

## Context / Philosophy

- Natural inspiration — bees and waggle dance, ants and pheromones; SDS is a distillation of these
- No central control — what "emergent" actually means; how order arises from local interactions
- Comparison with other swarm algorithms — PSO, ACO, briefly; what makes SDS distinctive
- Failure modes — when SDS doesn't work; pathological test functions, degenerate parameters
- Array vs HashMap swarm — two representations, why it matters, what the tradeoff reveals about the algorithm

## Interactives / Playgrounds

- Build your own SDS — pick D, T, H from a dropdown; run it
- Broken SDS playground — deliberately bad parameters; watch it fail and understand why
- Step-by-step debugger — advance one agent at a time; inspect state

## Reference

- Glossary — hypothesis, active, diffusion, test, cluster, etc.
- The D/T/I/H taxonomy — one page explaining the formal decomposition
- Bibliography / further reading — key papers, the thesis
