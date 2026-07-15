import { choice, hashPoll, hashPollWithMaps, poll, randInt } from "./polling";
import { Agent, Clusters, Hyp } from "../shared/type";

export interface Swarm {
  agentCount: number;
  poll: () => Agent;
  forAll: (f: (agent: Agent) => Agent) => Swarm;
  iter: () => Iterable<Agent>;
  replace: (old: Agent, next: Agent) => Swarm;
  getClusters: (
    maxClusters: number,
    minClusterSize: number,
  ) => Map<Hyp, number>;
  getActivity: () => number;
}

export interface HashSwarm extends Swarm {
  clusters: Clusters;
}

export interface ArraySwarm extends Swarm {
  agents: Agent[];
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
  replace: (old, next) =>
    makeArraySwarm(agents.map((a) => (a === old ? next : a))),
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
  getActivity: () => agents.filter((a) => a.active).length / agents.length,
});

export const initArraySwarm = (agentCount: number): ArraySwarm =>
  makeArraySwarm(Array(agentCount).fill(null).map(initAgent));

export const initHashSwarm = (agentCount: number): HashSwarm => {
  const clusters: Clusters = new Map<Hyp, number>();
  return makeHashSwarm(agentCount, clusters);
};

export const makeHashSwarm = (
  agentCount: number,
  clusters: Clusters,
): HashSwarm => {
  function* iter(): Generator<Agent, void, void> {
    const a: Agent = initAgent();
    a.active = true;
    yield a;
    yield initAgent();
  }

  function increment(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
  }
  function decrement(map, key) {
    const newValue = Math.max((map.get(key) || 1) - 1, 0);
    if (newValue == 0) {
      map.delete(key);
    } else {
      map.set(key, newValue);
    }
  }

  function forAll(f: (agent: Agent) => Agent): HashSwarm {
    const clusters: Clusters = new Map<Hyp, number>();
    let agentCount = 0;
    for (let agent of iter()) {
      const newAgent = f(agent);
      agentCount += 1;
      if (newAgent.active) {
        increment(clusters, newAgent.hyp);
      }
    }
    return makeHashSwarm(agentCount, clusters);
  }

  function replace(old: Agent, next: Agent): HashSwarm {
    const newClusters = new Map(clusters);
    if (next.active) {
      increment(newClusters, next.hyp);
    }
    if (old.active) {
      decrement(newClusters, old.hyp);
    }
    return makeHashSwarm(agentCount, newClusters);
  }

  function getActivity(): number {
    let activeCount: number = 0;
    for (let clusterSize of clusters.values()) {
      activeCount += clusterSize;
    }
    return activeCount/agentCount
  }

  return {
    clusters,
    agentCount,
    poll: () => hashPollWithMaps(clusters, agentCount),
    forAll,
    iter,
    replace,
    getClusters: () => clusters,
    getActivity,
  };
};