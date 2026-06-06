import { Swarm } from "../shared/swarm";
import { Diffusion } from "./diffusion";
import { Testing } from "./testing";

export const ISynchronous = (D: Diffusion, T: Testing, swarm: Swarm): Swarm =>
  swarm.forAll(agent => T(D(agent, swarm)));

export type Iteration = () => void;
