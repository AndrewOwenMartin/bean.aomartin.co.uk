Status: wontfix

# 01: H type — pass swarm to halting function

## Problem

`SDS` currently calls `H()` with no arguments. Swarm-state halting functions (`HUnique`, `HLargest`, `HActivity`, `HStrong`, `HWeak`, `HStable`) need the current swarm on each call. There is no clean way to give them the updated swarm under the current signature.

## Solution

Change the halting type to `(swarm: Swarm) => boolean`. Update `SDS` to call `H(swarm)` after each iteration. Existing `makeHFixed` returns a function that accepts and ignores the swarm argument.

```ts
// Before
export const SDS = (I, H, swarm) => {
  while (!H()) { swarm = I(swarm); }
  return swarm;
};

// After
export const SDS = (I, H, swarm) => {
  while (!H(swarm)) { swarm = I(swarm); }
  return swarm;
};
```

`makeHFixed` signature change:
```ts
// Before
function HFixed(): boolean { ... }

// After
function HFixed(_swarm: Swarm): boolean { ... }
```

## Impact

- `SDS` in `sds.ts` — one-line change to the loop condition
- `makeHFixed` in `halting.ts` — add ignored `_swarm: Swarm` parameter
- `SDSStandard` in `sds.ts` — no change (it wraps `makeHFixed`)
- Tests — no functional change; H is called the same number of times

## Depends on

Nothing. Prerequisite for issues 12–16.

## Comments

Closed: type change rejected in favour of the closure pattern. Factories for swarm-state halting functions receive `getSwarm: () => Swarm` and close over it. `H` stays `() => boolean`. The caller owns the swarm variable and the loop:

```ts
let swarm = initArraySwarm(100);
const H = makeHActivity(0.5, () => swarm);
while (!H()) { swarm = ISynchronous(D, T, swarm); }
```

Issues 12–16 are unblocked and use this pattern.
