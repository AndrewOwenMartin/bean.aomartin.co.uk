export interface Agent {
  hyp: number;
  active: boolean;
}
export type Swarm = Agent[];
export type Iteration = () => void;
export type Microtest = (hyp: number) => boolean;
export type Diffusion = (agent: Agent, swarm: Swarm) => Agent;
export type Testing = (agent: Agent) => Agent;
