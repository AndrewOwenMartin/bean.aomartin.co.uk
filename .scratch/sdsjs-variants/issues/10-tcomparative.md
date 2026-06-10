Status: done

# 10: TComparative — comparative testing

## Problem

Comparative testing is not implemented. Instead of a fixed pass/fail threshold, an agent compares its microtest score against the score of a randomly polled agent. The agent becomes active if its score is strictly higher. No fixed threshold is required.

## Thesis reference

Algorithm 23 (TCOMPARATIVE), section 3.4.3.3. Also described in `bean/markdown/microtest-design.mdx`.

## Design note: scalar microtests

`Microtest` is currently `(hyp: Hyp) => boolean`. Comparative testing requires a numeric score. Two options:

1. **New type for comparative microtests:**
   ```ts
   type ScalarMicrotest = (hyp: Hyp) => number;
   type ScalarTestSelector = () => ScalarMicrotest;
   ```
   `TComparative` uses `ScalarTestSelector` instead of `TestSelector`. The two test selectors are incompatible.

2. **Threshold conversion:** pass a `ScalarTestSelector` and internally convert boolean tests to 0/1, or use scores directly. Same as option 1 in practice.

Option 1 is cleaner — comparative and boolean tests are distinct concepts.

## Signature

```ts
export const TComparative = (
  TM: ScalarTestSelector,
  hyp: Hyp,
  swarm: Swarm,
): Agent
```

## Implementation sketch

```ts
export const TComparative = (TM, hyp, swarm) => {
  const microtest = TM();
  const polled = swarm.poll();
  const scoreA = microtest(hyp);
  const scoreP = microtest(polled.hyp);
  return { hyp, active: scoreA > scoreP };
};
```

## Note on halting

`TComparative` maintains that the highest-scoring hypothesis always has some active agents, so global activity never reaches zero. Any halting method that relies on low global activity will not work. The thesis notes this explicitly (section 3.4.3.3).

## Depends on

Issue 02 (T type change) — `TComparative` relies on the swarm being passed to testing.
