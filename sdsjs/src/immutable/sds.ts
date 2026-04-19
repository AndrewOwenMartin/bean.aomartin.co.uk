import { choice, poll, randInt } from "../shared/polling";
import { initSwarm } from "../shared/swarm";
import { Agent, Microtest, Swarm } from "../shared/type";

const SDS = (I, H) => {
  while (!H) {
    I();
  }
};

const ISynchronous = (D, T, swarm: Swarm): Swarm => {
  return swarm.map(D).map(T);
};

const DPassive = (DH, agent, swarm): Agent => {
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
const TMUniform = (microtests: Microtest[]) => choice(microtests);

const TBoolean = (TM, agent: Agent): Agent => {
  const microtest = TM();
  return {
    hyp: agent.hyp,
    active: microtest(agent.hyp),
  };
};

const makeHFixed = (maxIterations: number) => {
  let iterationCount = 0;
  function* HFixed(): Generator<false, true, never> {
    while (iterationCount < maxIterations) {
      yield false;
      iterationCount += 1;
    }
    return true;
  }
  return HFixed;
};

const SDSStandard = (
  swarm: Swarm,
  hypCount: number,
  microtests: Microtest[],
) => {
  const H = makeHFixed(100);
  const DH = () => DHUniform(hypCount);
  const D = (agent: Agent) => DPassive(DH, agent, swarm);
  const TM = () => TMUniform(microtests);
  const T = (agent: Agent) => TBoolean(TM, agent);
  const I = () => ISynchronous(D, T, swarm);
  const mySDS = (swarm: Swarm): Swarm => {
    while (!H()) {
      swarm = I();
    }
    return swarm;
  };
  return mySDS;
};

// const mySearchSpace: string = "xxxxxhexlodxxxsakllajadsweklhheaekfjllkahelehlehlehlexxx"
// const model: string = "hello"

// const myMicrotests: Microtest[] = model.split('').map(
//     (targetElement, index) => {
//         return (hyp: number) => mySearchSpace[hyp+index] === targetElement
//     }
// )

// const agentCount = 10
// let swarm = initSwarm(agentCount)

// const mySDS = SDSStandard(swarm, mySearchSpace.length, myMicrotests)

// swarm = mySDS(swarm)

// console.log({swarm})
