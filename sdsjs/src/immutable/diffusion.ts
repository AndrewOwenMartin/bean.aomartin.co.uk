import { poll, randInt } from "../shared/polling";
import { Agent, Hyp, Swarm } from "../shared/type";
export type Diffusion = (agent: Agent, swarm: Swarm) => Agent;
export type NewHyp = () => Hyp;

export const DPassive = (DH: NewHyp, agent: Agent, swarm: Swarm): Agent => {
  if (agent.active) {
    return agent;
  }

  const polled = poll(swarm);

  const hyp = polled.active ? polled.hyp : DH();

  return {
    active: false,
    hyp,
  };
};

export const DHUniform = (hypCount: number) => randInt(hypCount);
