Status: done

# 07: DNoise — hypothesis transmission noise

## Problem

Noisy diffusion is not implemented. When an inactive agent recruits from an active agent, it applies a perturbation function to the hypothesis rather than copying it exactly. This induces hill-climbing behaviour in continuous or structured search spaces.

## Thesis reference

Algorithm 22 (DNOISE), section 3.4.3.2. Also described in `bean/markdown/hypothesis-mutation.mdx`.

## Types

```ts
export type NoiseFunction = (hyp: Hyp) => Hyp;
```

`Hyp` is currently `number`, so `NoiseFunction` maps a number to a nearby number. The most common example is Gaussian noise.

## Signature

```ts
export const DNoise = (noise: NoiseFunction, DH: NewHyp, agent: Agent, swarm: Swarm): Hyp
```

## Implementation sketch

```ts
export const DNoise = (noise, DH, agent, swarm) => {
  if (agent.active) return agent.hyp;
  const polled = swarm.poll();
  return polled.active ? noise(polled.hyp) : DH();
};
```

## Noise function helpers

Export a factory for Gaussian noise:

```ts
export const makeGaussianNoise = (sigma: number): NoiseFunction => (hyp) => {
  // Box-Muller transform or similar
  ...
  return hyp + gaussianSample * sigma;
};
```

## Note on cluster detection

With `DNoise`, agents in a cluster no longer share the same hypothesis. The `analysis/clusters.ts` module (if it counts identical hypotheses) will not detect clusters correctly for this variant. This is a known limitation documented in the MDX page. The ticket does not require fixing cluster detection.

## Depends on

Nothing. Self-contained. Exports `NoiseFunction` type and `DNoise` and `makeGaussianNoise`.
