import { Swarm } from "../shared/swarm";
import { Agent} from "../shared/type";
import { Diffusion } from "./diffusion";
import { Testing } from "./testing";

export const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm => {
  const result = swarm.agents.map((agent: Agent) => D(agent, swarm)).map(T);
  return result
  // start here, how to do generic isynchronous?
  // do I have to iterate over all agents, or can I be cleverer?
  // I just need to implement a swarm based 'map' so I can map D then T.
};

export type Iteration = () => void;
