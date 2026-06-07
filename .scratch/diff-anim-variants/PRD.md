Status: ready-for-agent

# PRD: Reusable DiffAnim for multiple diffusion variants

Depends on: `../diff-anim-style-refactor/PRD.md`

## Problem Statement

The `DiffAnim` animation is hardcoded to `DPassive`. The bean site needs to explain `DPassive`, `DChance`, `DContextFree`, and `DContextSensitive` — each with its own step-by-step animation and code highlight. Duplicating the animation component four times would make each copy hard to maintain and keep visually consistent.

## Solution

Extract the variant-specific concerns (step definitions, code string, step-to-line mapping, transition logic) into a `DiffusionSpec` value. `DiffAnim` becomes a generic component that accepts any `DiffusionSpec` and renders the same agent-swarm visualisation. Each diffusion variant is a separate spec object, importable by any MDX page.

## User Stories

1. As a reader, I want to see an animated step-by-step walkthrough for `DPassive`, so that I can follow the algorithm line by line.
2. As a reader, I want to see an equivalent animation for `DChance`, so that I can compare its branching behaviour to `DPassive`.
3. As a reader, I want to see an equivalent animation for `DContextFree`, so that I understand how polling without an activity check differs.
4. As a reader, I want to see an equivalent animation for `DContextSensitive`, so that I can follow its more nuanced state transitions.
5. As a reader, I want the animations for different variants to look and feel the same, so that comparisons are intuitive.
6. As an author writing MDX, I want to embed any diffusion variant animation with a single import and component tag, so that pages stay concise.
7. As a developer adding a new diffusion variant, I want to write only a spec object rather than a new component, so that I don't duplicate rendering logic.
8. As a developer, I want the spec to be type-safe, so that a missing step or bad line number is a compile error rather than a silent bug.
9. As a developer, I want the transition logic in the spec to be independent of React, so that it can be unit-tested without rendering.
10. As a developer, I want the animation's reducer to be driven by the spec, so that step sequencing and agent updates are fully determined by the spec's transition function.

## Implementation Decisions

- **`DiffusionSpec` interface.** A spec value captures everything variant-specific:
  - `steps`: ordered list of step name constants for this variant
  - `initialStep`: which step the animation starts on
  - `pollingSteps`: set of step names during which the connector line is shown
  - `codeLine`: map from step name to highlighted line index
  - `code`: the Python snippet string to display
  - `transition`: pure function `(state: AnimState, step: StepName) => AnimState` — given the current animation state and the current step, returns the next state (next step, updated agents, updated polled index). This is where the diffusion logic lives and where `DPassive`, `DChance`, etc. differ.

- **`DPassiveSpec`, `DChanceSpec`, `DContextFreeSpec`, `DContextSensitiveSpec`.** One spec object per variant in `diffusion.ts` library, exported alongside the existing `DPassive` etc. functions. The transition functions in these specs should call the corresponding `sds` library functions rather than re-implementing the logic.

- **`useDiffAnim` accepts a spec.** The hook takes a `DiffusionSpec` as its argument. The reducer is initialised from `spec.steps`, `spec.initialStep`, and delegates each tick to `spec.transition`.

- **`DiffAnim` accepts a spec as a prop.** The component is parameterised by `spec: DiffusionSpec` in its props. The SVG visualisation (agents as circles on the hypothesis axis) is unchanged — it is already representation-agnostic.

- **Spec objects live in `bean/src/diff-anim/`.** They are presentation-layer concerns (they include Python code strings and line mappings) rather than library concerns, so they do not belong in `sdsjs`.

- **Step names are scoped per spec.** Each spec defines its own step union type; `DiffAnim` is generic over the step type. This avoids a single global `Step` union that must enumerate all variants' steps.

## Testing Decisions

The `transition` function in each spec is a pure function and the right unit-test seam. Tests should call `transition` directly with a given `AnimState` and `StepName` and assert the returned state, without rendering any component.

The visual behaviour (connector shown/hidden, circle positions, code highlight) is best verified by running the dev server and stepping through each variant manually. No automated rendering tests are required for this ticket.

Prior art: `sdsjs` tests call library functions directly with constructed `Swarm` and `Agent` values — the same pattern applies to spec transition functions.

## Out of Scope

- Animations for the T (Test), I (Iteration), or H (Halting) taxonomy members.
- Any change to the SVG layout or visual design of the animation.
- A variant-picker UI embedded in a single component (each MDX page embeds the specific variant it needs).
- The `DChance` probability parameter UI — for now the chance value is fixed in the spec.

## Further Notes

`DiffAnim` currently has a subtle bug: CSS transitions on SVG `x1`/`y1` attributes do not animate in browsers. The connector line position therefore jumps rather than slides. This is tracked separately and is out of scope here, but the refactor should not make it harder to fix later — keeping the connector as a `<line>` element with class-driven styles is fine.
