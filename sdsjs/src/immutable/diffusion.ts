import { choice, poll, randChance, randInt } from "./polling";
import { Swarm } from "./swarm";
import { Agent, Hyp } from "../shared/type";
export type Diffusion = (agent: Agent, swarm: Swarm) => Hyp;
export type NewHyp = () => Hyp;
export type DiffusionCombinator = (polled: Agent[]) => Agent | null;
export type NoiseFunction = (hyp: Hyp) => Hyp;

export const DPassive = (DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  if (agent.active) {
    return agent.hyp;
  }

  const polled = swarm.poll()

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
  const polled = swarm.poll()

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
  const polled = swarm.poll()
  let hyp = agent.hyp;
  if (!agent.active && polled.active) {
    hyp = polled.hyp;
  } else if (!agent.active || (polled.active && polled.hyp === agent.hyp)) {
    hyp = DH();
  }
  return hyp;
};

export const DHUniform = (hypCount: number) => randInt(hypCount);

// Issue 05: hermit diffusion — active polled agents refuse to share with probability `hermitage`
export const DHermit = (hermitage: number, DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  if (agent.active) return agent.hyp;
  const polled = swarm.poll();
  if (polled.active && !randChance(hermitage)) return polled.hyp;
  return DH();
};

// Issue 06: multi-diffusion — poll `amount` agents, apply combinator to decide whether and from whom to diffuse
export const DMultiDiffusion = (
  amount: number,
  combinator: DiffusionCombinator,
  DH: NewHyp,
  agent: Agent,
  swarm: Swarm,
): Hyp => {
  if (agent.active) return agent.hyp;
  const polled = Array.from({ length: amount }, () => swarm.poll());
  const chosen = combinator(polled);
  return chosen ? chosen.hyp : DH();
};

export const DMultiDiffusionOr: DiffusionCombinator = (polled) => {
  const active = polled.filter(a => a.active);
  return active.length > 0 ? choice(active) : null;
};

export const DMultiDiffusionAnd: DiffusionCombinator = (polled) =>
  polled.every(a => a.active) ? choice(polled) : null;

// Issue 07: noisy diffusion — apply a perturbation function to the recruited hypothesis
export const DNoise = (noise: NoiseFunction, DH: NewHyp, agent: Agent, swarm: Swarm): Hyp => {
  if (agent.active) return agent.hyp;
  const polled = swarm.poll();
  return polled.active ? noise(polled.hyp) : DH();
};

export const makeGaussianNoise = (sigma: number): NoiseFunction => (hyp) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return hyp + z * sigma;
};
