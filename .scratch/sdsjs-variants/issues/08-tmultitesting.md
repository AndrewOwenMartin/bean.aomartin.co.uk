Status: done

# 08: TMultiTesting — multi-testing

## Problem

Multi-testing is not implemented. Agents perform `amount` microtests per iteration and combine the results with a combinator (AND or OR). This effectively raises or lowers the apparent score of all hypotheses.

## Thesis reference

Algorithm 16 (TMULTI-TESTING), section 3.4.2.1.

## Types

```ts
type TestCombinator = (results: boolean[]) => boolean;
```

## Signature

```ts
export const TMultiTesting = (
  amount: number,
  combinator: TestCombinator,
  TM: TestSelector,
  hyp: Hyp,
  swarm: Swarm,
): Agent

export const TMultiTestingAnd: TestCombinator  // all must pass
export const TMultiTestingOr: TestCombinator   // any must pass
```

## Implementation sketch

```ts
export const TMultiTesting = (amount, combinator, TM, hyp, _swarm) => {
  const results = Array.from({ length: amount }, () => TM()(hyp));
  return { hyp, active: combinator(results) };
};

export const TMultiTestingAnd: TestCombinator = (results) => results.every(Boolean);
export const TMultiTestingOr: TestCombinator = (results) => results.some(Boolean);
```

Note: `amount = 1` with either combinator is equivalent to `TBoolean`.

## Depends on

Issue 02 (T type change, for the `swarm` parameter in the signature). `TMultiTesting` ignores swarm but must accept it to satisfy the `Testing` type.
