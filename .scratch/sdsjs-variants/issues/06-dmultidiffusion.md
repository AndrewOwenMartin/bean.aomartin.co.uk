Status: done

# 06: DMultiDiffusion — multi-diffusion

## Problem

Multi-diffusion is not implemented. Inactive agents poll multiple agents and apply a combinator to determine whether diffusion occurs and from which agent the hypothesis is taken.

## Thesis reference

Algorithm 17 (DMULTI-DIFFUSION), section 3.4.2.2.

## Signature

```ts
type DiffusionCombinator = (polled: Agent[]) => Agent | null;

export const DMultiDiffusion = (
  amount: number,
  combinator: DiffusionCombinator,
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Hyp

export const DMultiDiffusionOr: DiffusionCombinator  // any active → pick one active at random
export const DMultiDiffusionAnd: DiffusionCombinator // all active → pick one active at random
```

Combinator returns an `Agent` to adopt its hypothesis, or `null` to fall back to `DH()`.

## Implementation sketch

```ts
export const DMultiDiffusion = (amount, combinator, DH, agent, swarm) => {
  if (agent.active) return agent.hyp;
  const polled = Array.from({ length: amount }, () => swarm.poll());
  const chosen = combinator(polled);
  return chosen ? chosen.hyp : DH();
};

export const DMultiDiffusionOr: DiffusionCombinator = (polled) => {
  const active = polled.filter(a => a.active);
  return active.length > 0 ? choice(active) : null;
};

export const DMultiDiffusionAnd: DiffusionCombinator = (polled) => {
  return polled.every(a => a.active) ? choice(polled) : null;
};
```

`choice` is already available in `shared/polling`.

## Depends on

Nothing. Self-contained.
