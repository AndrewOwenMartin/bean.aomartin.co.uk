import { choice, poll, randInt } from "../shared/polling";
import { Agent, Diffusion, Microtest, Swarm, Testing, } from "../shared/type";


const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm => {
  return swarm.map((agent: Agent) => D(agent, swarm)).map(T);
};

export const DPassive = (DH, agent: Agent, swarm: Swarm): Agent => {
  // Could make P for polling, and not pass swarm.
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
export const TMUniform = (microtests: Microtest[]) => choice(microtests);

export const TBoolean = (TM, agent: Agent): Agent => {
  const microtest = TM();
  return {
    hyp: agent.hyp,
    active: microtest(agent.hyp),
  };
};

export const makeHFixed = (maxIterations: number) => {
  let iterationCount = 0;
  function HFixed() {
    iterationCount += 1;
    return iterationCount > maxIterations;
  }
  return HFixed;
};

export const SDSStandard = (
  hypCount: number,
  microtests: Microtest[],
) => {
  const DH = () => DHUniform(hypCount);
  const D = (agent: Agent, swarm: Swarm) => DPassive(DH, agent, swarm);
  const TM = () => TMUniform(microtests);
  const T = (agent: Agent) => TBoolean(TM, agent);
  const I = (swarm: Swarm) => ISynchronous(D, T, swarm);
  return (swarm: Swarm) => {
    const H = makeHFixed(100);
    swarm = SDS(I, H, swarm)
    return swarm
  }
};

const SDS = (I: (swarm: Swarm) => Swarm, H: () => boolean, swarm: Swarm) => {
  while (!H()) {
    swarm = I(swarm);
  }
  return swarm
};