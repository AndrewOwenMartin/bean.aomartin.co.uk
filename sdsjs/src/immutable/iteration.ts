import { Agent, Swarm } from "../shared/type";
import { Diffusion } from "./diffusion";
import { Testing } from "./testing";

export const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm => {
  return swarm.map((agent: Agent) => D(agent, swarm)).map(T);
};

export type Iteration = () => void;
