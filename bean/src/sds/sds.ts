import React from "react";

interface Agent {
  hyp?: number;
  active: boolean;
}

export const useMinimalSDS = () => {
  const defaults: {
    swarm: Record<number, number>;
    space: number[];
  } = {
    swarm: Array(10).fill({ hyp: undefined, active: false }),
    space: Array(10)
      .fill(0)
      .map((x) => Math.random()),
  };

  const [swarm, setSwarm] = React.useState(defaults.swarm);
  const [space, setSpace] = React.useState(defaults.space);

  const diffuse = () => {
    const newSwarm = swarm.map((agent, index, swarm) => {
      if (agent.active) {
        return agent;
      }
      const polled = array[Math.floor(Math.random() * swarm.length)];
      if (polled.active) {
        return {
          active: false,
          hyp: polled.hyp,
        };
      } else {
        return {
          active: false,
          hyp: Math.floor(Math.random() * space.length),
        };
      }
    });
    setSwarm(newSwarm);
  };

  const test = () => {};

  const iterate = () => {};

  return {
    iterate,
    swarm,
    space,
  };
};
