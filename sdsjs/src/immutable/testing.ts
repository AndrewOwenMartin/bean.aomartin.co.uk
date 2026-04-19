import { choice } from "../shared/polling";
import { Agent, Hyp } from "../shared/type";
export type Microtest = (hyp: Hyp) => boolean;
export type Testing = (hyp: Hyp) => Agent;
export type TestSelector = () => Microtest;

export const TMUniform = (microtests: Microtest[]) => choice(microtests);

export const TBoolean = (TM: TestSelector, hyp: Hyp): Agent => {
  const microtest = TM();
  return {
    hyp,
    active: microtest(hyp),
  };
};
