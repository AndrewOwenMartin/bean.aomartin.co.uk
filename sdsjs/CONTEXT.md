# sdsjs — Domain Context

## Purpose

A TypeScript library implementing Stochastic Diffusion Search (SDS) algorithms in a modular, functional style. The primary goal is to implement all published SDS variants so that new variants can be designed by composing or replacing individual functions. It is also a research artifact — comparing two swarm representations (array vs hashmap) to understand their tradeoffs, which is currently unexplored in the SDS literature.

## The D/T/I/H Taxonomy

SDS is formally decomposed into four function types. This taxonomy comes from the published SDS literature (and Andrew Martin's PhD thesis). **If a variant cannot be described in these terms, it is arguably not SDS.**

- **D (Diffusion)** — given an agent and a swarm, returns a new hypothesis for that agent
- **T (Test)** — given a hypothesis, returns a new `Agent` (active or inactive)
- **I (Iteration)** — applies D then T to every agent in a swarm, returning a new swarm
- **H (Halting)** — stateful predicate called once per iteration; returns `true` when the search should stop

`SDS(I, H, swarm)` is the main loop: repeatedly applies `I` until `H()` returns true.

Different variants differ in exactly which of D, T, I, or H they change. The prefix letters in function names (`DPassive`, `TBoolean`, `ISynchronous`, `makeHFixed`) are load-bearing — they indicate which part of the taxonomy the function implements.

## Swarm Representations

Two representations are under development:

**ArraySwarm** (`immutable/`) — stores all agents as `Agent[]`. Complete and tested. This is the reference implementation.

**HashSwarm** (`hashmap/`) — stores only active agents as `Map<Hyp, count>`, where the count is the cluster size. WIP. The goal is to understand the performance and semantic tradeoffs vs ArraySwarm, not just to optimise.

### Swarm Interface

D and T are representation-agnostic. Only I needs a per-swarm implementation. The `Swarm` interface exposes:

```typescript
interface Swarm {
  agentCount: number;
  poll: () => Agent;
  forAll: (f: (agent: Agent) => Agent) => Swarm;
}
```

`forAll` is the abstract equivalent of `Array.map` — it applies a transformation to every agent and returns a new `Swarm` of the same type. This keeps `ISynchronous` representation-agnostic:

```typescript
const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm =>
  swarm.forAll(agent => T(D(agent, swarm)));
```

`agents` is not part of the public interface — it is an implementation detail of each concrete swarm type.

## Variant Scope

**Phase 1 — canonical published variants:**
- Standard SDS (passive diffusion)
- Context-free SDS
- Context-sensitive SDS

**Phase 2 — novel variants from the thesis:**
- ReducingSDS (halting propagates within the swarm via a novel H)
- Running-mean SDS
- Quorum sensing SDS

## Design Principles

- No animation-specific design. The library is pure algorithm. It has no knowledge of React or UI.
- Consumers (animations, tests) compose library functions directly — call `I`, `D`, `T` individually as needed.
- The library will be consumed by `bean` via npm workspaces (`import { SDSStandard } from 'sds'`). It is not yet published to npm.

## Key Types

```typescript
type Hyp = number;

interface Agent {
  hyp: Hyp;
  active: boolean;
}

type Diffusion = (agent: Agent, swarm: Swarm) => Hyp;
type Testing = (hyp: Hyp) => Agent;
type Microtest = (hyp: Hyp) => boolean;
```
