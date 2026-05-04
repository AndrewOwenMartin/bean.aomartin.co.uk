import { choice, randInt } from "./polling";
import { Agent, Hyp } from "./type";

const initAgent = () => ({
  hyp: 0,
  active: false,
});

export const initSwarm = (agentCount: number): Agent[] => {
  return Array(agentCount).fill(null).map(initAgent);
};

// export const makeSwarm = (agentCount: number) => {
//   const swarm = initSwarm(agentCount)

//   const poll = (swarm: Swarm): Agent => {
//     return choice(swarm);
//   };

//   return {
//     swarm,
//     poll,
//   }
// }

abstract class Swarm {
  swarm!: Agent[] | Map<Hyp, number>;
  agentCount!: number;

  abstract poll(): Agent;
}

export class ArraySwarm extends Swarm {
  swarm: Agent[];

  constructor(agentCount: number) {
    super();
    const swarm = initSwarm(agentCount);
    this.agentCount = agentCount;
    this.swarm = swarm;
  }
  poll = (): Agent => {
    return choice(this.swarm);
  };
}

export class HashSwarm extends Swarm {
  swarm: Map<number, number>;
  agentCount: number;

  constructor(agentCount: number) {
    super();
    this.agentCount = agentCount;
    this.swarm = new Map();
  }
  poll = (): Agent => {
    const agentIndex = randInt(this.agentCount);
    let accumulator = 0;
    let polledHyp = -1;
    let active = false;
    for (const [hyp, count] of this.swarm.entries()) {
      accumulator += count;
      if (accumulator > agentIndex) {
        polledHyp = hyp;
        active = true;
        break;
      }
    }
    return { hyp: polledHyp, active };
  };
}
