Status: done

# 13: HUnique + HLargest + HActivity — swarm-state threshold halting

## Problem

Three threshold halting functions based on swarm state are not implemented:
- `HUnique`: halt when unique hypothesis count drops below a threshold
- `HLargest`: halt when the largest cluster (as a fraction of swarm) exceeds a threshold
- `HActivity`: halt when global activity (fraction of active agents) exceeds a threshold

## Thesis reference

Algorithms 26 (HUNIQUE), 27 (HLARGEST), 28 (HACTIVITY), section 3.4.5.2.

## Signatures

```ts
export const makeHUnique = (uniqueCount: number) => (swarm: Swarm): boolean
export const makeHLargest = (threshold: number) => (swarm: Swarm): boolean
export const makeHActivity = (threshold: number) => (swarm: Swarm): boolean
```

All thresholds are in [0, 1] except `uniqueCount` which is an integer.

## Implementation dependency: cluster analysis

`HLargest` requires computing the largest cluster size. This needs the cluster analysis module (`analysis/clusters.ts`). Check what it currently exports and whether it operates on `Swarm` or `ArraySwarm`.

`HUnique` requires counting unique hypotheses among all agents. Also cluster-analysis-adjacent — may use the same module or a simpler scan.

`HActivity` is the simplest: count active agents and divide by `swarm.agentCount`. It needs neither cluster analysis nor `agents` access if `Swarm` exposes a way to count active agents. Currently it does not — active agent count would require accessing `ArraySwarm.agents`.

## Design note: Swarm interface gap

None of `HUnique`, `HLargest`, or `HActivity` can be implemented using the abstract `Swarm` interface alone (`poll`, `forAll`, `agentCount`). They all need to inspect the agent collection. Options:

1. Add an `activeCount` getter to `Swarm` for `HActivity`. `HUnique` and `HLargest` still need more.
2. Accept `ArraySwarm` explicitly. Same limitation as issue 11.
3. Add `toArray(): Agent[]` to `Swarm` interface for inspection-only use.

`toArray()` is the most general. It makes the agent list available for read-only use without coupling to implementation details. `ArraySwarm` returns `this.agents`; HashSwarm would expand the map.

## Depends on

Issue 01 (H type change). May also require an interface change to `Swarm` (toArray or activeCount).
