import { choice, hashPoll, poll, randInt } from "./polling";
import { Agent, Hyp } from "./type";

type SwarmType = 'hashSwarm' | 'arraySwarm'

export interface Swarm {
  agents: any;
  agentCount: number;
  poll: () => Agent;
  // type: SwarmType
}

export interface HashSwarm extends Swarm{
  agents: Map<Hyp, number>;
  // type: 'hashSwarm';
}

export interface ArraySwarm extends Swarm{
  agents: Agent[];
  // type: 'arraySwarm';
}

const initAgent = (): Agent => ({
  hyp: 0,
  active: false,
});

export const initArraySwarm = (agentCount: number): ArraySwarm => {

  const agents = Array(agentCount).fill(null).map(initAgent);
  return {
    agents,
    agentCount,
    poll: () => poll(agents),
    // type: 'arraySwarm',
  }
};

export const initHashSwarm = (agentCount: number): Swarm => {
  const agents: Map<Hyp,number> = new Map<Hyp, number>()
  return {
    agents,
    agentCount,
    poll: () => hashPoll(agents, agentCount),
    // type: 'hashSwarm',
  }
}

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

