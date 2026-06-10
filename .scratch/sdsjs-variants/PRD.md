Status: in-progress

# PRD: SDS variant functions for sdsjs

## Problem Statement

The `sdsjs` library currently implements only the standard SDS configuration. The thesis formalises 20+ named variants across D, T, I, and H — but the library exposes only `DPassive`, `DHUniform`, `TBoolean`, `TMUniform`, `ISynchronous`, and `makeHFixed`. Additionally, `DChance`, `DContextFree`, and `DContextSensitive` are implemented but not exported.

Without the variant functions, the library cannot be used to reproduce thesis experiments, demonstrate the variants on the bean site, or let consumers select the right variant for their task.

## Solution

Implement all named variant functions from the thesis. Each function belongs to exactly one of the four phases (D, T, I, H) and its name carries the phase prefix. The function signatures must be consistent enough within each phase that variants are interchangeable in a composed `SDS(I, H, swarm)` call.

Two cross-cutting type changes are prerequisites for some variants:

1. **H receives the swarm** — `SDS` must pass the current swarm to `H` each iteration (`H: (swarm: Swarm) => boolean`). Required for swarm-state halting functions.
2. **T receives the swarm** — `ISynchronous` must pass the current swarm to `T` (`Testing: (hyp: Hyp, swarm: Swarm) => Agent`). Required for `TComparative`. Existing `TBoolean` ignores the argument.

## Scope

See individual issues for each function. All implementations live in `sdsjs/src/immutable/` and are exported from `index.ts`.

| # | Issue | Phase | Status |
|---|-------|-------|--------|
| 01 | H type: pass swarm to halting function | cross-cutting | wontfix — closure pattern used instead |
| 02 | T type: pass swarm to testing function | cross-cutting | wontfix — closure pattern used instead |
| 03 | Export DChance, DContextFree, DContextSensitive | D | ready-for-agent |
| 04 | DActive + TActive → redesigned as IActive | I | done — implemented as IActive in iteration.ts |
| 05 | DHermit | D | ready-for-agent |
| 06 | DMultiDiffusion | D | ready-for-agent |
| 07 | DNoise | D | ready-for-agent |
| 08 | TMultiTesting | T | ready-for-agent |
| 09 | TOptimist | T | ready-for-agent |
| 10 | TComparative | T | ready-for-agent |
| 11 | IAsynchronous | I | done — implemented via iter+replace on Swarm |
| 12 | HTime + HIndefinite | H | ready-for-agent |
| 13 | HUnique + HLargest + HActivity | H | ready-for-agent |
| 14 | HStrong + HWeak | H | ready-for-agent |
| 15 | HStable | H | ready-for-agent |
| 16 | HAnd + HOr (halting combinators) | H | ready-for-agent |

## Infrastructure completed

- `Swarm` interface gained `iter(): Iterable<Agent>` and `replace(old, next): Swarm`. Implemented on `ArraySwarm`; HashSwarm has throwing stubs. These are the substrate for `IAsynchronous` and `IActive`.
- `IActive` replaces the `DActive`/`TActive` pair. Signature is `IActive(TM, swarm)` — deliberately incompatible with `ISynchronous(D, T, swarm)` to reflect the significance of the semantic change.
