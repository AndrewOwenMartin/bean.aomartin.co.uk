Status: done

# 05: DHermit — hermit diffusion

## Problem

Hermit diffusion is not implemented. Inactive agents poll as in passive diffusion, but active agents refuse to share their hypothesis with some probability (`hermitage`). When an active agent refuses, the polling agent falls back to `DH()`.

## Thesis reference

Algorithm 18 (DHERMIT), section 3.4.2.3.

## Signature

```ts
export const DHermit = (hermitage: number, DH: NewHyp, agent: Agent, swarm: Swarm): Hyp
```

- `hermitage`: probability [0, 1] that an active polled agent refuses to share.
- At `hermitage = 0`: identical to `DPassive`.
- At `hermitage = 1`: all active agents refuse; equivalent to all agents calling `DH()`.

## Implementation sketch

```ts
export const DHermit = (hermitage: number, DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  if (agent.active) return agent.hyp;
  const polled = swarm.poll();
  if (polled.active && !randChance(hermitage)) {
    return polled.hyp;
  }
  return DH();
};
```

## Depends on

Nothing. Straightforward extension of `DPassive`.
