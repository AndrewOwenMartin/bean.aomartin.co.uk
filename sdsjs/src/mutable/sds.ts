import { poll } from "../shared/polling";
import { Agent, Swarm } from "../shared/type";

const SDS = (I, H) => {
  while (!H) {
    I();
  }
};

const ISynchronous = (D, T, swarm: Swarm): void => {
  swarm.forEach(D);
  swarm.forEach(T);
};

const DPassive = (DH, agent, swarm) => {
  if (agent.active) {
    return;
  } else {
    const polled = poll(swarm);
    if (polled.active) {
      agent.hyp = polled.hyp;
    } else {
      agent.hyp = DH();
    }
  }
};

const DHUniform = () => {};
