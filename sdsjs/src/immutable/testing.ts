import { choice, randChance } from "../shared/polling";
import { Swarm } from "../shared/swarm";
import { Agent, Hyp } from "../shared/type";
export type Microtest = (hyp: Hyp) => boolean;
export type Testing = (hyp: Hyp) => Agent;
export type TestSelector = () => Microtest;
export type TestCombinator = (results: boolean[]) => boolean;
export type ScalarMicrotest = (hyp: Hyp) => number;
export type ScalarTestSelector = () => ScalarMicrotest;

export const TMUniform = (microtests: Microtest[]) => choice(microtests);

export const TBoolean = (TM: TestSelector, hyp: Hyp): Agent => {
  const microtest = TM();
  return {
    hyp,
    active: microtest(hyp),
  };
};

// Issue 08: multi-testing — run `amount` microtests and combine results
export const TMultiTestingAnd: TestCombinator = (results) => results.every(Boolean);
export const TMultiTestingOr: TestCombinator = (results) => results.some(Boolean);

export const TMultiTesting = (
  amount: number,
  combinator: TestCombinator,
  TM: TestSelector,
  hyp: Hyp,
): Agent => ({
  hyp,
  active: combinator(Array.from({ length: amount }, () => TM()(hyp))),
});

// Issue 09: secret optimist — failed tests are ignored with probability `optimism`
export const TOptimist = (optimism: number, TM: TestSelector, hyp: Hyp): Agent => ({
  hyp,
  active: TM()(hyp) || randChance(optimism),
});

// Issue 10: comparative testing — become active if score exceeds a randomly polled agent's score
export const TComparative = (
  TM: ScalarTestSelector,
  getSwarm: () => Swarm,
  hyp: Hyp,
): Agent => {
  const microtest = TM();
  const polled = getSwarm().poll();
  return { hyp, active: microtest(hyp) > microtest(polled.hyp) };
};
