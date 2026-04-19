import { Swarm } from "../shared/type";

export const countClusters = (swarm: Swarm) => {
  return swarm.reduce((counter, agent) => {
    const cluster = agent.active ? agent.hyp : 'inactive'
    const size = counter[cluster] ?? 0
    counter[cluster] = size + 1
    return counter
  }, {} as {[key in string]: number})

}