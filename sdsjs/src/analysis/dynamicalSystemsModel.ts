import { makeHFixed } from "../immutable/halting";

/*
 * A runnable simulation of the Discrete Dynamical Systems Model (DDSM) described in
 * thesis/003.2-mathematical-analysis-of-sds.md. The search space is collapsed to exactly
 * two loci: the optimal hypothesis and homogeneous background noise (everything else).
 * The swarm is never represented as individual agents, only as the proportion of the
 * population in each {locus} x {active, inactive} cell — the large-population limit where
 * a real swarm's random polling settles into its expected proportions each iteration.
 *
 * D and T are therefore not representation-agnostic here, unlike immutable/ and hashmap/:
 * there is no single Agent for them to operate on, only population-wide rates. See
 * sdsjs/CONTEXT.md for why this deviates from the usual D/T/I/H split.
 */

export interface DDSMState {
  activeOptimal: number;
  inactiveOptimal: number;
  activeNoise: number;
  inactiveNoise: number;
}

interface PostDiffusion {
  optimal: number;
  noise: number;
}

export const makeInitialState = (seedActiveOptimal: number): DDSMState => ({
  activeOptimal: seedActiveOptimal,
  inactiveOptimal: 0,
  activeNoise: 0,
  inactiveNoise: 1 - seedActiveOptimal,
});

export const DDSMDiffuse = (state: DDSMState): PostDiffusion => {
  /*
   * Mirrors DPassive: active agents keep their hypothesis; inactive agents poll a uniformly
   * random agent and copy its hypothesis if active, else generate a new one (which, since the
   * optimal hypothesis is one of a very large search space, is assumed to always land on noise).
   */
  const activity = state.activeOptimal + state.activeNoise;
  const inactiveMass = state.inactiveOptimal + state.inactiveNoise;

  return {
    optimal: state.activeOptimal + inactiveMass * state.activeOptimal,
    noise:
      state.activeNoise + inactiveMass * (state.activeNoise + (1 - activity)),
  };
};

export const DDSMTest = (
  alpha: number,
  beta: number,
  postDiffusion: PostDiffusion,
): DDSMState => ({
  /*
   * Mirrors TBoolean: every agent is (re)tested at its current hypothesis regardless of
   * whether it was previously active.
   */
  activeOptimal: alpha * postDiffusion.optimal,
  inactiveOptimal: (1 - alpha) * postDiffusion.optimal,
  activeNoise: beta * postDiffusion.noise,
  inactiveNoise: (1 - beta) * postDiffusion.noise,
});

export const DDSMIterate = (
  alpha: number,
  beta: number,
  state: DDSMState,
): DDSMState => DDSMTest(alpha, beta, DDSMDiffuse(state));

export const runDDSM = (
  alpha: number,
  beta: number,
  initial: DDSMState,
  maxIterations: number,
): DDSMState[] => {
  const H = makeHFixed(maxIterations);
  const trajectory = [initial];
  let state = initial;
  while (!H()) {
    state = DDSMIterate(alpha, beta, state);
    trajectory.push(state);
  }
  return trajectory;
};

export const DDSMStandard =
  (alpha: number, beta: number, maxIterations: number) =>
  (initial: DDSMState): DDSMState[] =>
    runDDSM(alpha, beta, initial, maxIterations);

// Minimum convergence criterion, thesis eq. 3.6: d/dc [f(alpha, beta, c)] > 1 at c=0.
export const alphaMin = (beta: number): number => 1 / (2 - beta);
