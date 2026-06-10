Status: done

# 09: TOptimist — secret optimist testing

## Problem

Secret optimist testing is not implemented. When an agent fails a microtest, it becomes inactive only with probability `(1 - optimism)` — with probability `optimism` it stays active despite the failure. This raises the effective score of all hypotheses.

## Thesis reference

Algorithm 19 (TOPTIMIST), section 3.4.2.4.

## Signature

```ts
export const TOptimist = (
  optimism: number,
  TM: TestSelector,
  hyp: Hyp,
  _swarm: Swarm,
): Agent
```

- `optimism`: probability [0, 1] that a failed test is ignored.
- At `optimism = 0`: identical to `TBoolean`.

## Implementation sketch

```ts
export const TOptimist = (optimism, TM, hyp, _swarm) => {
  const microtest = TM();
  const passed = microtest(hyp);
  return { hyp, active: passed || randChance(optimism) };
};
```

## Depends on

Issue 02 (T type change) for the `_swarm` parameter.
