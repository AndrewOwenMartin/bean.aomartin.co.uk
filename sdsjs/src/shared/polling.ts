import { Agent, Swarm } from "./type";

export const choice = <T>(array: T[]): T => {
  return array[randInt(array.length)];
};

export const randInt = (maxExc: number): number => {
  return Math.floor(Math.random() * maxExc);
};

export const randChance = (p: number): boolean => {
  return Math.random() < p;
};

export const poll = (swarm: Swarm): Agent => {
  return choice(swarm);
};
