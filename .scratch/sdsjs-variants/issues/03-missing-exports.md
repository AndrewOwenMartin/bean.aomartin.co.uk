Status: done

# 03: Export DChance, DContextFree, DContextSensitive

## Problem

`DChance`, `DContextFree`, and `DContextSensitive` are implemented in `diffusion.ts` but not exported from `index.ts`. Library consumers cannot use them.

## Solution

Add to `index.ts`:
```ts
export { DHUniform, DPassive, DChance, DContextFree, DContextSensitive } from "./immutable/diffusion";
```

Also export the `NewHyp` type for consumers who want to partially apply DH:
```ts
export type { NewHyp } from "./immutable/diffusion";
```

## Impact

- `index.ts` — two lines changed
- No logic changes

## Depends on

Nothing. Can be merged independently.
