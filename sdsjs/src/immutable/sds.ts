import { Agent, Swarm } from "../shared/type";
import { DHUniform, DPassive } from "./diffusion";
import { makeHFixed } from "./halting";
import { ISynchronous } from "./iteration";
import { TMUniform, TBoolean, Microtest } from "./testing";

export const SDSStandard = (
  hypCount: number,
  microtests: Microtest[],
  maxIterations: number,
) => {
  const DH = () => DHUniform(hypCount);
  const D = (agent: Agent, swarm: Swarm) => DPassive(DH, agent, swarm);
  const TM = () => TMUniform(microtests);
  const T = (agent: Agent) => TBoolean(TM, agent);
  const I = (swarm: Swarm) => ISynchronous(D, T, swarm);
  return (swarm: Swarm) => {
    const H = makeHFixed(maxIterations);
    swarm = SDS(I, H, swarm);
    return swarm;
  };
};

const SDS = (I: (swarm: Swarm) => Swarm, H: () => boolean, swarm: Swarm) => {
  while (!H()) {
    swarm = I(swarm);
  }
  return swarm;
};
