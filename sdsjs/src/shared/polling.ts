import { ArraySwarm, HashSwarm } from "./swarm";
import { Agent, Hyp } from "./type";

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

export const hashPoll = (agents: Map<Hyp, number>, agentCount: number): Agent => {
  const agentIndex = randInt(agentCount)

  let current = 0;
  for (let [hyp, count] of agents) {
    const agent: Agent = {
      hyp,
      active: true,
    }
    return agent
  }
  const agent: Agent = {
    hyp: 0,
    active: false,
  }
  return agent

}

interface SwarmArrays{
  hyps: Hyp[];
  clusterSizes: number[];
}

interface Cluster{
  hyp: Hyp,
  accumulatedClusterSize: number;

}

const mapToArrays = (clusters: Map<Hyp, number>): [Cluster[], SwarmArrays] => {
  const clustersArray: Cluster[] = []
  const arrays: SwarmArrays = {
    hyps: [],
    clusterSizes: [],
  }
  let acc = 0;
  for (let [hyp, clusterSize] of clusters){
    arrays.hyps.push(hyp)
    acc += clusterSize
    arrays.clusterSizes.push(acc)
    clustersArray.push({
      hyp,
      accumulatedClusterSize: acc,
    })
  }
  return [ clustersArray, arrays ]
}

export const hashPollWithMaps = (swarm: HashSwarm): Agent => {
  const agentIndex = randInt(swarm.agentCount)

  const [clustersArray, {hyps, clusterSizes}] = mapToArrays(swarm.agents)

  let current = 0;
  const clusterIndex = binarySearch(clusterSizes, agentIndex)

  let hyp: Hyp = 0;
  let active: boolean;
  if(clusterIndex < hyps.length){
    hyp = hyps[clusterIndex]
    active = true
  }else{
    hyp = 0
    active = false
  }

  return {hyp, active}

}

const binarySearch = (sortedAccumulators: number[], target: number) => {
  let low = 0
  let high = sortedAccumulators.length;
  while (low != high) {
      let mid = (low + high) / 2;
      if (sortedAccumulators[mid] <= target) {
          low = mid + 1;
      }
      else {
          high = mid;
      }
  }
  return low
}