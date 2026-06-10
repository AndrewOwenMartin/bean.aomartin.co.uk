Status: wontfix

# 02: T type — pass swarm to testing function

## Problem

`Testing` is currently `(hyp: Hyp) => Agent`. `TComparative` (issue 10) needs to poll a random agent from the swarm during the test phase. There is no way to give the testing function swarm access without changing the type.

## Solution

Change `Testing` to `(hyp: Hyp, swarm: Swarm) => Agent`. Update `ISynchronous` to pass the swarm:

```ts
// Before
export const ISynchronous = (D, T, swarm) =>
  swarm.forAll(agent => T(D(agent, swarm)));

// After
export const ISynchronous = (D, T, swarm) =>
  swarm.forAll(agent => T(D(agent, swarm), swarm));
```

`TBoolean` accepts and ignores the swarm:
```ts
export const TBoolean = (TM: TestSelector, hyp: Hyp, _swarm: Swarm): Agent => { ... }
```

## Impact

- `iteration.ts` — one-line change
- `testing.ts` — `TBoolean` signature gains `_swarm: Swarm`
- `sds.ts` — `SDSStandard` partial-applies `TBoolean`, needs updating
- Tests — no functional change

## Depends on

Nothing. Prerequisite for issue 10 (TComparative).

## Comments

Closed: type change rejected in favour of the closure pattern. `TComparative` (issue 10) receives `getSwarm: () => Swarm` in its factory and closes over it. `Testing` stays `(hyp: Hyp) => Agent`. Issue 10 is unblocked.
