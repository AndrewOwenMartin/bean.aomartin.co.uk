import { ArraySwarm} from "../shared/swarm";
import { Hyp } from "../shared/type";

export const countClusters = (swarm: ArraySwarm): Map<Hyp, number> => {
  return swarm.agents.reduce(
    (counter, agent) => {
      if(agent.active){
        const hyp = agent.hyp
        const size = counter[hyp] ?? 0;
        counter.set(hyp,size + 1);
      }
      return counter;
    },
    new Map<Hyp, number>(),
  );
};
