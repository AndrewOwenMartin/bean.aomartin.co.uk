import { Agent } from "./type";

const initAgent = () => ({
  hyp: 0,
  active: false,
});

export const initSwarm = (agentCount: number): Agent[] => {
  return Array(agentCount).fill(null).map(initAgent);
};
