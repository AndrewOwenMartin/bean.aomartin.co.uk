import { Swarm } from "../shared/swarm";

export type HaltingFn = () => boolean;

export const makeHFixed = (maxIterations: number): HaltingFn => {
  let iterationCount = 0;
  function HFixed() {
    iterationCount += 1;
    return iterationCount > maxIterations;
  }
  return HFixed;
};

// Issue 12: time-based halting
export const makeHTime = (maxMs: number): HaltingFn => {
  const start = Date.now();
  return () => Date.now() - start > maxMs;
};

export const HIndefinite: HaltingFn = () => false;

// Issue 13: swarm-state threshold halting
const largestClusterFraction = (swarm: Swarm): number => {
  const clusters = swarm.getClusters(1, 1);
  const largest = clusters.size > 0 ? Math.max(...clusters.values()) : 0;
  return largest / swarm.agentCount;
};

const countUniqueHyps = (swarm: Swarm): number =>
  swarm.getClusters(Infinity, 1).size;

export const makeHActivity = (threshold: number, getSwarm: () => Swarm): HaltingFn =>
  () => getSwarm().getActivity() >= threshold;

export const makeHLargest = (threshold: number, getSwarm: () => Swarm): HaltingFn =>
  () => largestClusterFraction(getSwarm()) >= threshold;

export const makeHUnique = (uniqueCount: number, getSwarm: () => Swarm): HaltingFn =>
  () => countUniqueHyps(getSwarm()) <= uniqueCount;

// Issue 14: convergence halting — halt when a measured value stays within [a-b, a+b] for T iterations
export const makeHWeak = (a: number, b: number, T: number, getSwarm: () => Swarm): HaltingFn => {
  let t = 0;
  return () => {
    const activity = getSwarm().getActivity();
    if (Math.abs(activity - a) < b) { t += 1; } else { t = 0; }
    return t >= T;
  };
};

export const makeHStrong = (a: number, b: number, T: number, getSwarm: () => Swarm): HaltingFn => {
  let t = 0;
  return () => {
    const fraction = largestClusterFraction(getSwarm());
    if (Math.abs(fraction - a) < b) { t += 1; } else { t = 0; }
    return t >= T;
  };
};

// Issue 15: stable global activity halting — halt when activity std dev stays below threshold
const standardDeviation = (values: number[]): number => {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

export const makeHStable = (
  maxMemorySize: number,
  minStability: number,
  minStableIterations: number,
  getSwarm: () => Swarm,
): HaltingFn => {
  const memory: number[] = [];
  let stableCount = 0;
  return () => {
    const activity = getSwarm().getActivity();
    memory.push(activity);
    if (memory.length > maxMemorySize) memory.shift();
    if (standardDeviation(memory) <= minStability) {
      stableCount += 1;
      if (stableCount >= minStableIterations) return true;
    } else {
      stableCount = 0;
    }
    return false;
  };
};

// Issue 16: halting combinators
export const HAnd = (...fns: HaltingFn[]): HaltingFn =>
  () => fns.every(f => f());

export const HOr = (...fns: HaltingFn[]): HaltingFn =>
  () => fns.some(f => f());
