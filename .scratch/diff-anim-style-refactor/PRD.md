Status: done

# PRD: Refactor DiffAnim to STYLE.md conventions

## Problem Statement

The `DiffAnim` animation component was written before the project coding style was formalised in `STYLE.md`. It violates several of those guidelines: step names are magic strings repeated throughout the file, internal functions use `function` declarations rather than arrow notation, inline SVG styles belong in the CSS file, and the component/hook separation pattern is not fully applied.

## Solution

Refactor `DiffAnim.tsx` and `diff-anim.css` to conform to `STYLE.md` without changing any visible behaviour. The animation, controls, and code-highlighting panel should work identically after the refactor.

## User Stories

1. As a developer reading the file, I want step identifiers to be typed constants, so that I can rename or refactor them with confidence.
2. As a developer, I want all functions defined with fat arrow notation, so that the codebase is consistent and `this`-binding surprises are impossible.
3. As a developer, I want transition and display styles in the CSS file rather than inline, so that visual behaviour is co-located with other visual rules.
4. As a developer, I want the component to receive the hook's return value as props, so that the component is a pure rendering function with no logic of its own.
5. As a developer, I want event-to-value conversion to happen at the JSX boundary (in the component), so that hook functions never accept DOM events.
6. As a future agent, I want each concern to live in a predictable place (hook vs component vs CSS), so that I can locate and modify behaviour quickly.
7. As a developer, I want complex step-transition logic expressed as a reducer, so that the state machine is explicit and each transition is independently readable.

## Implementation Decisions

- **Step names as a union type and constants.** The `STEPS` string array and the repeated string literals (`"nextAgent"`, `"checkActive"`, etc.) should be replaced with a `Step` union type and a set of named constants, making the step state machine type-safe. `STEP_LINE` and `POLLING_STEPS` should reference those constants.

- **Arrow functions throughout.** `function useDiffAnim()` and `function computePositions()` become arrow functions. `initAgents` and `replaceAt` are already arrows and need no change.

- **Component/hook separation.** The component `DiffAnim` should accept `props: ReturnType<typeof useDiffAnim>` and contain only JSX and event-to-value wiring. A thin wrapper (or the export itself) calls `useDiffAnim()` and spreads the result in. No hooks should live inside the rendering component.

- **Reducer for step transitions.** The `step` callback is a manual state machine. Extract it to a reducer: `(state: DiffAnimState, action: DiffAnimAction) => DiffAnimState`. `useDiffAnim` becomes a thin wrapper around `useReducer`. This makes each transition a named case and removes the need for `useCallback` over captured state.

- **Inline styles to CSS.** The `style` props on the `<svg>`, `<line>` (connector), and `<circle>` elements (`display: block`, opacity transition, cx/cy transition) should move into `diff-anim.css` as class rules. Note: CSS transitions on SVG presentation attributes `x1`/`y1` do not work in browsers — the connector position transition on the `<line>` element should be removed rather than ported.

## Testing Decisions

`DiffAnim` is a visual animation component with no existing unit tests. The correct test for this refactor is visual: run the dev server, confirm the animation plays, pauses, steps, and resets identically to before. Automated tests are out of scope for this ticket — the refactor is purely structural and the risk is accidental behaviour change, which is best caught by eyeballing the running component.

If a future ticket adds tests, the correct seam is the `useDiffAnim` hook's public return value — test that stepping through actions produces the expected `agents`, `currentAgent`, and `currentStep` values.

## Out of Scope

- Fixing the non-functional CSS transition on the connector line's `x1`/`y1` endpoints (a separate bug).
- Any change to the animation's logic, timing, or visual design.
- Adding automated tests for the component.
- Refactoring other animation components (those are separate tickets).

## Further Notes

`STYLE.md` is new as of this sprint and this is the first component being brought into conformance. The patterns established here — particularly the reducer shape and the component/hook boundary — will serve as prior art for future animation components.
