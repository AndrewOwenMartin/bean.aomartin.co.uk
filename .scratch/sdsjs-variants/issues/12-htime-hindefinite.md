Status: done

# 12: HTime + HIndefinite — time-based halting

## Problem

Wall-clock time halting and indefinite (never-halt) are not implemented.

## Thesis reference

Algorithms 24 (HTIME) and 25 (HINDEFINITE), section 3.4.5.1.

## Signatures

```ts
// Halts after a given number of milliseconds.
export const makeHTime = (maxMs: number) => (_swarm: Swarm): boolean

// Never halts. Useful for observation-only use of SDS.
export const HIndefinite = (_swarm: Swarm): boolean  // always returns false
```

Note: `HIndefinite` is not a factory — it has no state and can be a plain exported function.

## Implementation sketch

```ts
export const makeHTime = (maxMs: number) => {
  const start = Date.now();
  return (_swarm: Swarm): boolean => Date.now() - start > maxMs;
};

export const HIndefinite = (_swarm: Swarm): boolean => false;
```

## Depends on

Issue 01 (H type change).
