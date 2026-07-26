import { Agent, Clusters, Hyp } from "../shared/type";

export const choice = <T>(array: T[]): T => {
  return array[randInt(array.length)];
};

export const randInt = (maxExc: number): number => {
  return Math.floor(Math.random() * maxExc);
};

export const randChance = (p: number): boolean => {
  return Math.random() < p;
};

export const poll = (agents: Agent[]): Agent => {
  return choice(agents);
};

export const hashPoll = (clusters: Clusters, agentCount: number): Agent => {
  const agentIndex = randInt(agentCount);

  let current = 0;
  for (let [hyp, count] of clusters) {
    current += count;
    if (current > agentIndex) {
      const agent: Agent = {
        hyp,
        active: true,
      };
      return agent;
    }
  }
  const agent: Agent = {
    hyp: 0,
    active: false,
  };
  return agent;
};

interface SwarmArrays {
  hyps: Hyp[];
  accumulatedClusterSizes: number[];
}

interface Cluster {
  hyp: Hyp;
  accumulatedClusterSize: number;
}

const mapToArrays = (clusters: Clusters): SwarmArrays => {
  const hyps: number[] = [];
  const accumulatedClusterSizes: number[] = [];
  let acc = 0;
  for (let [hyp, clusterSize] of clusters) {
    hyps.push(hyp);
    acc += clusterSize;
    accumulatedClusterSizes.push(acc);
  }
  return { hyps, accumulatedClusterSizes };
};

export const hashPollWithMaps = (
  clusters: Clusters,
  agentCount: number,
): Agent => {
  const agentIndex = randInt(agentCount);

  const { hyps, accumulatedClusterSizes } = mapToArrays(clusters);

  const clusterIndex = binarySearch(accumulatedClusterSizes, agentIndex);

  const active = clusterIndex < hyps.length;
  const hyp = active ? hyps[clusterIndex] : 0;

  return { hyp, active };
};

const binarySearch = (sortedAccumulators: number[], target: number) => {
  let low = 0;
  let high = sortedAccumulators.length;
  while (low != high) {
    let mid = (low + high) / 2;
    if (sortedAccumulators[mid] <= target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};
