import { choice, hashPoll, poll, randInt } from "./polling";
import { Agent, Hyp } from "./type";

type SwarmType = 'hashSwarm' | 'arraySwarm'

export interface Swarm {
  agentCount: number;
  poll: () => Agent;
  forAll: (f: (agent: Agent) => Agent) => Swarm;
  iter: () => Iterable<Agent>;
  replace: (old: Agent, next: Agent) => Swarm;
  getClusters: (maxClusters: number, minClusterSize: number) => Map<Hyp, number>;
  getActivity: () => number;
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
  iter: () => agents,
  replace: (old, next) => makeArraySwarm(agents.map(a => a === old ? next : a)),
  getClusters: (maxClusters, minClusterSize) => {
    const counts = new Map<Hyp, number>();
    for (const agent of agents) {
      if (agent.active) {
        counts.set(agent.hyp, (counts.get(agent.hyp) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()]
      .filter(([, n]) => n >= minClusterSize)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxClusters);
    return new Map(sorted);
  },
  getActivity: () => agents.filter(a => a.active).length / agents.length,
});

export const initArraySwarm = (agentCount: number): ArraySwarm =>
  makeArraySwarm(Array(agentCount).fill(null).map(initAgent));

export const initHashSwarm = (agentCount: number): Swarm => {
  const agents: Map<Hyp, number> = new Map<Hyp, number>();
  return {
    agentCount,
    poll: () => hashPoll(agents, agentCount),
    forAll: () => { throw new Error("HashSwarm.forAll not yet implemented"); },
    iter: () => { throw new Error("HashSwarm.iter not yet implemented"); },
    replace: () => { throw new Error("HashSwarm.replace not yet implemented"); },
    getClusters: () => { throw new Error("HashSwarm.getClusters not yet implemented"); },
    getActivity: () => { throw new Error("HashSwarm.getActivity not yet implemented"); },
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
