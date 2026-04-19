import { poll, randChance, randInt } from "../shared/polling";
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
    active: agent.active,
    hyp,
  };
};

export const DChance = (
  chance: number,
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Agent => {
  if (randChance(chance)) {
    return {
      active: agent.active,
      hyp: agent.hyp,
    };
  }
  return DPassive(DH, agent, swarm);
};

export const DContextFree = (DH: NewHyp, agent: Agent, swarm: Swarm): Agent => {
  const polled = poll(swarm);

  // Generate a new hypothesis if both agents are active, or both are inactive.
  const newHyp = agent.active === polled.active;

  // If only polled is active, diffuse. If only agent is active, maintain.
  const hyp = newHyp ? DH() : agent.active ? agent.hyp : polled.hyp;

  return {
    active: agent.active,
    hyp,
  };
};

export const DContextSensitive = (
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Agent => {
  const polled = poll(swarm);
  let hyp = agent.hyp;
  if (!agent.active && polled.active) {
    hyp = polled.hyp;
  } else if (!agent.active || (polled.active && polled.hyp === agent.hyp)) {
    hyp = DH();
  }
  return {
    active: agent.active,
    hyp,
  };
};

export const DHUniform = (hypCount: number) => randInt(hypCount);
