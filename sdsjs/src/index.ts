export { SDS, SDSStandard } from "./immutable/sds";
export {
  DHUniform,
  DPassive,
  DChance,
  DContextFree,
  DContextSensitive,
  DHermit,
  DMultiDiffusion,
  DMultiDiffusionOr,
  DMultiDiffusionAnd,
  DNoise,
  makeGaussianNoise,
} from "./immutable/diffusion";
export type {
  DHFunction,
  DiffusionCombinator,
  NoiseFunction,
} from "./immutable/diffusion";
export {
  TBoolean,
  TMUniform,
  TMultiTesting,
  TMultiTestingAnd,
  TMultiTestingOr,
  TOptimist,
  TComparative,
} from "./immutable/testing";
export type {
  Microtest,
  Testing,
  TestSelector,
  TestCombinator,
  ScalarMicrotest,
  ScalarTestSelector,
} from "./immutable/testing";
export {
  makeHFixed,
  makeHTime,
  HIndefinite,
  makeHActivity,
  makeHLargest,
  makeHUnique,
  makeHWeak,
  makeHStrong,
  makeHStable,
  HAnd,
  HOr,
} from "./immutable/halting";
export type { HaltingFn } from "./immutable/halting";
export { ISynchronous, IAsynchronous, IActive } from "./immutable/iteration";
export { initArraySwarm } from "./immutable/swarm";
export type { Swarm, ArraySwarm } from "./immutable/swarm";
export type { Agent, Hyp } from "./shared/type";
