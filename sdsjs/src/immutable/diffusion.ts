import { poll, randChance, randInt } from "../shared/polling";
import { Agent, Hyp, Swarm } from "../shared/type";
export type Diffusion = (agent: Agent, swarm: Swarm) => Hyp;
export type NewHyp = () => Hyp;

export const DPassive = (DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  if (agent.active) {
    return agent.hyp;
  }

  const polled = poll(swarm);

  const hyp = polled.active ? polled.hyp : DH();

  return hyp;
};

export const DChance = (
  chance: number,
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Hyp => {
  if (randChance(chance)) {
    return DH();
  }
  return DPassive(DH, agent, swarm);
};

export const DContextFree = (DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  const polled = poll(swarm);

  // Generate a new hypothesis if both agents are active, or both are inactive.
  const newHyp = agent.active === polled.active;

  // If only polled is active, diffuse. If only agent is active, maintain.
  const hyp = newHyp ? DH() : agent.active ? agent.hyp : polled.hyp;

  return hyp;
};

export const DContextSensitive = (
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Hyp => {
  const polled = poll(swarm);
  let hyp = agent.hyp;
  if (!agent.active && polled.active) {
    hyp = polled.hyp;
  } else if (!agent.active || (polled.active && polled.hyp === agent.hyp)) {
    hyp = DH();
  }
  return hyp;
};

export const DHUniform = (hypCount: number) => randInt(hypCount);
