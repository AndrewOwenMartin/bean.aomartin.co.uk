Status: done

# 14: HStrong + HWeak — convergence halting (strong and weak criteria)

## Problem

Strong and weak halting criteria are not implemented. Both halt when a measured value stays within a band `[a-b, a+b]` for `T` consecutive iterations. HStrong uses the largest cluster size; HWeak uses global activity.

## Thesis reference

Algorithms 29 (HSTRONG) and 30 (HWEAK), section 3.4.5.3.

## Signatures

```ts
export const makeHStrong = (a: number, b: number, T: number) => (swarm: Swarm): boolean
export const makeHWeak = (a: number, b: number, T: number) => (swarm: Swarm): boolean
```

Parameters:
- `a`: target cluster size / activity level (fraction, [0, 1])
- `b`: tolerance band half-width
- `T`: number of consecutive in-band iterations required

## Implementation sketch

```ts
export const makeHWeak = (a: number, b: number, stabilityIterations: number) => {
  let t = 0;
  return (swarm: Swarm): boolean => {
    const activity = activeCount(swarm) / swarm.agentCount;
    if (Math.abs(activity - a) < b) {
      t += 1;
    } else {
      t = 0;
    }
    return t > stabilityIterations;
  };
};
```

`HStrong` is identical but uses `largestClusterFraction(swarm)` instead of `activity`.

## Depends on

Issue 01 (H type change), Issue 13 (for `activeCount` and `largestClusterFraction` helpers, or the Swarm interface extension).
