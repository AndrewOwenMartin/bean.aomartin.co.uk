import { choice } from "../shared/polling";
import { Agent, Hyp } from "../shared/type";
export type Microtest = (hyp: Hyp) => boolean;
export type Testing = (agent: Agent) => Agent;

export const TMUniform = (microtests: Microtest[]) => choice(microtests);

export const TBoolean = (TM, agent: Agent): Agent => {
  const microtest = TM();
  return {
    hyp: agent.hyp,
    active: microtest(agent.hyp),
  };
};
