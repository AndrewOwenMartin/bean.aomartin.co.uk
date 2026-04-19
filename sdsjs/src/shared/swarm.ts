import { Swarm } from "./type";

const initAgent = () => ({
  hyp: 0,
  active: false,
});

export const initSwarm = (agentCount: number): Swarm => {
  return Array(agentCount).fill(null).map(initAgent);
};
