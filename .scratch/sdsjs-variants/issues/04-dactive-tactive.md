Status: wontfix

# 04: DActive + TActive — active diffusion

## Problem

Active diffusion is not implemented. It inverts the polling direction: active agents poll inactive agents and push their hypothesis, rather than inactive agents polling active ones to pull a hypothesis.

## Thesis reference

Algorithm 15 (DACTIVE and TACTIVE), section 3.4.1.4.

## Signatures

```ts
// DActive: active agents push hypothesis to a random inactive agent.
// Inactive agents do nothing in diffusion — they will get a hypothesis via TActive.
export const DActive = (agent: Agent, swarm: Swarm): Hyp => { ... }

// TActive: on test failure, agent immediately selects a new hypothesis via DH.
export const TActive = (DH: NewHyp, TM: TestSelector, hyp: Hyp, swarm: Swarm): Agent => { ... }
```

## Behaviour

`DActive`:
- If agent is active: poll a random agent; if polled is inactive, return polled's hyp (which will be overwritten by the active agent's hyp — actually: active agent's hyp is passed to the inactive agent)
  
Wait — re-reading Algorithm 15: active agents poll random agents; if the polled agent is inactive, the active agent copies its *own* hypothesis to the polled agent (push). The active agent's hypothesis does not change. The polling agent's hypothesis is `agent.hyp` if active (unchanged), else the agent does nothing.

Pseudocode from thesis (corrected reading):
```
DACTIVE(agent, swarm):
  if agent is active:
    polled ← random agent in swarm
    if polled is inactive:
      // polled agent's hyp ← agent.hyp
      // But in our immutable model, DActive returns the new hyp for the *calling* agent,
      // not for the polled agent. This is a representation mismatch.
      pass
  return agent.hyp  // active agent keeps its own hyp
```

**Design note:** `DActive` cannot be implemented cleanly with the current `forAll` signature, which transforms each agent independently. In active diffusion, agent A's action modifies agent B. With `forAll`, the only way to "push" is to have B's transform look up whether any active agent was polling it — which requires different information.

One approach: implement `DActive` as a whole-swarm transform outside `forAll`. The `I` function for active diffusion would not use `ISynchronous`:

```ts
export const IActive = (TM: TestSelector, DH: NewHyp, swarm: Swarm): Swarm => {
  // 1. Each active agent selects a random inactive agent to push to.
  // 2. Each inactive agent that was pushed to takes the pushing agent's hyp.
  //    If an inactive agent is pushed to by >1 active agents, last write wins (or pick one).
  // 3. Inactive agents that were not pushed to call DH().
  // 4. All agents then run TActive.
  ...
}
```

This would make `IActive` a dedicated iteration function rather than composing `DActive` and `TActive` separately. The trade-off: less compositional, but the algorithm is inherently non-local.

## Decision needed

Resolve the push-vs-pull mismatch before implementing. Two options:
1. Implement as `IActive` (dedicated, non-compositional).
2. Add a `pushAll` method to `Swarm` that applies a many-to-many transform.

## Depends on

Issue 02 (T type change) if TActive follows the standard Testing signature.

## Comments

Closed: `DActive` and `TActive` as separate D/T functions are not implementable with `forAll` semantics — active diffusion has push (non-local) semantics that cannot be expressed as a per-agent transform. Decision: implement as `IActive`, a dedicated iteration variant that hardcodes the active SDS logic. Implemented in `sdsjs/src/immutable/iteration.ts` and exported from `index.ts`.

`IActive(TM, swarm)` — note the different signature from `ISynchronous(D, T, swarm)`. The incompatibility is intentional: it reflects how significant a change active diffusion is relative to passive.
