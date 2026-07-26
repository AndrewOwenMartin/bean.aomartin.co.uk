import { Swarm } from "./swarm";
import { Diffusion } from "./diffusion";
import { TBoolean, TestSelector, Testing } from "./testing";

export const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm =>
  swarm.forAll((agent) => T(D(agent, swarm)));

export const IAsynchronous = (
  D: Diffusion,
  T: Testing,
  swarm: Swarm,
): Swarm => {
  let current = swarm;
  for (const agent of swarm.iter()) {
    const hyp = D(agent, current);
    current = current.replace(agent, T(hyp));
  }
  return current;
};

export const IActive = (TM: TestSelector, swarm: Swarm): Swarm => {
  let current = swarm;
  for (const agent of swarm.iter()) {
    if (agent.active) {
      const target = current.poll();
      if (!target.active) {
        current = current.replace(target, TBoolean(TM, agent.hyp));
      }
      current = current.replace(agent, TBoolean(TM, agent.hyp));
    }
  }
  return current;
};

export type Iteration = () => void;
