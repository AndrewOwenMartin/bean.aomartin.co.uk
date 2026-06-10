Status: done

# 16: HAnd + HOr — halting combinators

## Problem

Halting functions cannot be composed. The thesis describes combining multiple halting functions using AND (halt only when all component functions say halt) and OR (halt when any component function says halt).

## Thesis reference

Section 3.4.5.4. Algorithm 32 (example combined halting) uses `HAnd` and `HOr`.

## Type

```ts
type HaltingFn = (swarm: Swarm) => boolean;
```

## Signatures

```ts
export const HAnd = (...fns: HaltingFn[]): HaltingFn
export const HOr = (...fns: HaltingFn[]): HaltingFn
```

## Implementation sketch

```ts
export const HAnd = (...fns: HaltingFn[]): HaltingFn =>
  (swarm) => fns.every(f => f(swarm));

export const HOr = (...fns: HaltingFn[]): HaltingFn =>
  (swarm) => fns.some(f => f(swarm));
```

Note: `HAnd` with short-circuit (`every`) will not call later functions once any returns false. This is fine — all functions are cheap predicates.

## Example from thesis (Algorithm 32)

```ts
const H = HAnd(
  makeHFixed(minimumIterations),
  HStable(memory, stableIterations),
  makeHActivity(minimumActivity),
);
const HMax = HOr(H, makeHFixed(maximumIterations));
```

## Depends on

Issue 01 (H type change). Logically depends on all halting functions being implemented, but can be implemented and tested independently with just `makeHFixed`.
