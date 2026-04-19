export interface Agent {
  hyp: number;
  active: boolean;
}
export type Swarm = Agent[];
export type Iteration = () => void;
export type Microtest = (hyp: number) => boolean;
