import { choice, hashPoll, poll, randInt } from "./polling";
import { Agent, Hyp } from "./type";

type SwarmType = 'hashSwarm' | 'arraySwarm'

export interface Swarm {
  agentCount: number;
  poll: () => Agent;
  forAll: (f: (agent: Agent) => Agent) => Swarm;
  // type: SwarmType
}

export interface HashSwarm extends Swarm {
  agents: Map<Hyp, number>;
  // type: 'hashSwarm';
}

export interface ArraySwarm extends Swarm {
  agents: Agent[];
  // type: 'arraySwarm';
}

const initAgent = (): Agent => ({
  hyp: 0,
  active: false,
});

const makeArraySwarm = (agents: Agent[]): ArraySwarm => ({
  agents,
  agentCount: agents.length,
  poll: () => poll(agents),
  forAll: (f) => makeArraySwarm(agents.map(f)),
});

export const initArraySwarm = (agentCount: number): ArraySwarm =>
  makeArraySwarm(Array(agentCount).fill(null).map(initAgent));

export const initHashSwarm = (agentCount: number): Swarm => {
  const agents: Map<Hyp, number> = new Map<Hyp, number>();
  return {
    agentCount,
    poll: () => hashPoll(agents, agentCount),
    forAll: () => { throw new Error("HashSwarm.forAll not yet implemented"); },
    // type: 'hashSwarm',
  };
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

