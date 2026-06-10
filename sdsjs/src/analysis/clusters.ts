import { Swarm } from "../shared/swarm";
import { Hyp } from "../shared/type";

export const countClusters = (swarm: Swarm): Map<Hyp, number> =>
  swarm.getClusters(Infinity, 1);
