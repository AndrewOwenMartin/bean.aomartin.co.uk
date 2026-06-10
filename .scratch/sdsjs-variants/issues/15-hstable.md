Status: done

# 15: HStable — stable global activity halting

## Problem

Running-mean stability halting is not implemented. It records global activity over a rolling window and halts when the standard deviation stays below a threshold for a minimum number of consecutive iterations.

## Thesis reference

Algorithm 31 (HSTABLE), section 3.4.5.3.

## Signature

```ts
export const makeHStable = (
  maxMemorySize: number,
  minStability: number,
  minStableIterations: number,
) => (swarm: Swarm): boolean
```

- `maxMemorySize`: rolling window length in iterations
- `minStability`: maximum standard deviation to be considered stable
- `minStableIterations`: consecutive stable iterations required before halting

## Implementation sketch

```ts
export const makeHStable = (maxMemorySize, minStability, minStableIterations) => {
  const memory: number[] = [];
  let stableCount = 0;
  return (swarm: Swarm): boolean => {
    const activity = activeCount(swarm) / swarm.agentCount;
    memory.push(activity);
    if (memory.length > maxMemorySize) memory.shift();
    const stddev = standardDeviation(memory);
    if (stddev <= minStability) {
      stableCount += 1;
      if (stableCount >= minStableIterations) return true;
    } else {
      stableCount = 0;
    }
    return false;
  };
};
```

`standardDeviation` is a small internal helper (mean → variance → sqrt). Can live in `halting.ts` or a shared math utility.

## Note

The thesis notes this method may halt prematurely if the swarm stabilises at low activity early on (before any cluster forms). It recommends combining with `HActivity` using `HAnd` (issue 16).

## Depends on

Issue 01 (H type change), Issue 13 (`activeCount` helper).
