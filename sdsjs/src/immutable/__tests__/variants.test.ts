import { expect, test } from '@jest/globals'
import {
  DChance,
  DHermit,
  DMultiDiffusion,
  DMultiDiffusionOr,
  DMultiDiffusionAnd,
  DNoise,
  makeGaussianNoise,
} from "../diffusion";
import {
  TMultiTesting,
  TMultiTestingAnd,
  TMultiTestingOr,
  TOptimist,
  TComparative,
} from "../testing";
import {
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
} from "../halting";
import { initArraySwarm } from "../swarm";

// ─── Diffusion ────────────────────────────────────────────────────────────────

test("DChance: with chance=0 behaves like DPassive (active agent keeps hypothesis)", () => {
  const swarm = initArraySwarm(1);
  const agent = { hyp: 7, active: true };
  expect(DChance(0, () => 99, agent, swarm)).toBe(7);
});

test("DChance: with chance=1 always generates new hypothesis regardless of agent state", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 5, active: true };
  const activeAgent = { hyp: 7, active: true };
  expect(DChance(1, () => 42, activeAgent, swarm)).toBe(42);
});

test("DHermit: active agent keeps its hypothesis", () => {
  const swarm = initArraySwarm(1);
  const agent = { hyp: 3, active: true };
  expect(DHermit(0, () => 99, agent, swarm)).toBe(3);
});

test("DHermit: hermitage=0 behaves like DPassive (active polled agent shares)", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 5, active: true };
  const agent = { hyp: 0, active: false };
  expect(DHermit(0, () => 99, agent, swarm)).toBe(5);
});

test("DHermit: hermitage=1 always falls back to DH", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 5, active: true };
  const agent = { hyp: 0, active: false };
  const results = Array.from({ length: 50 }, () => DHermit(1, () => 42, agent, swarm));
  expect(results.every(r => r === 42)).toBe(true);
});

test("DHermit: inactive polled agent falls back to DH", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 5, active: false };
  const agent = { hyp: 0, active: false };
  expect(DHermit(0, () => 99, agent, swarm)).toBe(99);
});

test("DMultiDiffusionOr: returns null when no active agents", () => {
  expect(DMultiDiffusionOr([{ hyp: 1, active: false }])).toBeNull();
});

test("DMultiDiffusionOr: returns active agent when one is active", () => {
  const active = { hyp: 7, active: true };
  const result = DMultiDiffusionOr([{ hyp: 1, active: false }, active]);
  expect(result).toEqual(active);
});

test("DMultiDiffusionAnd: returns null when not all active", () => {
  expect(DMultiDiffusionAnd([{ hyp: 1, active: true }, { hyp: 2, active: false }])).toBeNull();
});

test("DMultiDiffusionAnd: returns agent when all active", () => {
  const agents = [{ hyp: 1, active: true }, { hyp: 2, active: true }];
  const result = DMultiDiffusionAnd(agents);
  expect(result).not.toBeNull();
  expect(agents).toContain(result);
});

test("DMultiDiffusion: active agent keeps hypothesis", () => {
  const swarm = initArraySwarm(1);
  const agent = { hyp: 4, active: true };
  expect(DMultiDiffusion(2, DMultiDiffusionOr, () => 99, agent, swarm)).toBe(4);
});

test("DMultiDiffusion: falls back to DH when combinator returns null", () => {
  const swarm = initArraySwarm(2);
  swarm.agents[0] = { hyp: 1, active: false };
  swarm.agents[1] = { hyp: 2, active: false };
  const agent = { hyp: 0, active: false };
  expect(DMultiDiffusion(2, DMultiDiffusionAnd, () => 99, agent, swarm)).toBe(99);
});

test("DNoise: active agent keeps hypothesis unchanged", () => {
  const swarm = initArraySwarm(1);
  const agent = { hyp: 5, active: true };
  const noise = (h: number) => h + 1000;
  expect(DNoise(noise, () => 0, agent, swarm)).toBe(5);
});

test("DNoise: applies noise to recruited hypothesis", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 10, active: true };
  const agent = { hyp: 0, active: false };
  const noise = (h: number) => h + 5;
  expect(DNoise(noise, () => 0, agent, swarm)).toBe(15);
});

test("DNoise: falls back to DH when polled inactive", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 10, active: false };
  const agent = { hyp: 0, active: false };
  expect(DNoise(h => h + 5, () => 99, agent, swarm)).toBe(99);
});

test("makeGaussianNoise: returns a number near the input", () => {
  const noise = makeGaussianNoise(0.01);
  const result = noise(100);
  expect(typeof result).toBe("number");
  expect(Math.abs(result - 100)).toBeLessThan(1);
});

// ─── Testing ──────────────────────────────────────────────────────────────────

test("TMultiTestingAnd: all true → true", () => {
  expect(TMultiTestingAnd([true, true, true])).toBe(true);
});

test("TMultiTestingAnd: any false → false", () => {
  expect(TMultiTestingAnd([true, false, true])).toBe(false);
});

test("TMultiTestingOr: any true → true", () => {
  expect(TMultiTestingOr([false, true, false])).toBe(true);
});

test("TMultiTestingOr: all false → false", () => {
  expect(TMultiTestingOr([false, false])).toBe(false);
});

test("TMultiTesting: amount=1 with always-passing test → active", () => {
  const TM = () => (_: number) => true;
  expect(TMultiTesting(1, TMultiTestingAnd, TM, 5)).toEqual({ hyp: 5, active: true });
});

test("TMultiTesting: amount=3 AND with always-failing test → inactive", () => {
  const TM = () => (_: number) => false;
  expect(TMultiTesting(3, TMultiTestingAnd, TM, 5)).toEqual({ hyp: 5, active: false });
});

test("TMultiTesting: amount=3 OR with one-passing test → active", () => {
  let call = 0;
  const TM = () => (_: number) => call++ === 1;
  expect(TMultiTesting(3, TMultiTestingOr, TM, 5)).toEqual({ hyp: 5, active: true });
});

test("TOptimist: optimism=0 behaves like TBoolean", () => {
  const TM = () => (_: number) => false;
  const agent = TOptimist(0, TM, 5);
  expect(agent).toEqual({ hyp: 5, active: false });
});

test("TOptimist: optimism=1 always active regardless of test result", () => {
  const TM = () => (_: number) => false;
  const results = Array.from({ length: 50 }, () => TOptimist(1, TM, 5));
  expect(results.every(a => a.active)).toBe(true);
});

test("TOptimist: passing test always active", () => {
  const TM = () => (_: number) => true;
  expect(TOptimist(0, TM, 5)).toEqual({ hyp: 5, active: true });
});

test("TComparative: agent with higher score becomes active", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 1, active: false };
  const TM = () => (h: number) => h;
  const agent = TComparative(TM, () => swarm, 10);
  expect(agent.hyp).toBe(10);
  expect(agent.active).toBe(true);
});

test("TComparative: agent with lower score becomes inactive", () => {
  const swarm = initArraySwarm(1);
  swarm.agents[0] = { hyp: 100, active: true };
  const TM = () => (h: number) => h;
  const agent = TComparative(TM, () => swarm, 1);
  expect(agent.active).toBe(false);
});

// ─── Halting ──────────────────────────────────────────────────────────────────

test("HIndefinite: always returns false", () => {
  const swarm = initArraySwarm(1);
  expect(HIndefinite()).toBe(false);
  expect(HIndefinite()).toBe(false);
});

test("makeHTime: returns false immediately then true after delay", async () => {
  const H = makeHTime(50);
  expect(H()).toBe(false);
  await new Promise(r => setTimeout(r, 60));
  expect(H()).toBe(true);
});

test("makeHActivity: halts when activity meets threshold", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 1, active: true };
  swarm.agents[1] = { hyp: 1, active: true };
  let ref = swarm;
  const H = makeHActivity(0.5, () => ref);
  expect(H()).toBe(true);
});

test("makeHActivity: does not halt below threshold", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 1, active: true };
  let ref = swarm;
  const H = makeHActivity(0.5, () => ref);
  expect(H()).toBe(false);
});

test("makeHLargest: halts when largest cluster fraction meets threshold", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 5, active: true };
  swarm.agents[1] = { hyp: 5, active: true };
  swarm.agents[2] = { hyp: 5, active: true };
  let ref = swarm;
  const H = makeHLargest(0.5, () => ref);
  expect(H()).toBe(true);
});

test("makeHUnique: halts when unique hypotheses at or below threshold", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 1, active: true };
  swarm.agents[1] = { hyp: 2, active: true };
  let ref = swarm;
  const H = makeHUnique(2, () => ref);
  expect(H()).toBe(true);
});

test("makeHUnique: does not halt when too many unique hypotheses", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 1, active: true };
  swarm.agents[1] = { hyp: 2, active: true };
  swarm.agents[2] = { hyp: 3, active: true };
  let ref = swarm;
  const H = makeHUnique(2, () => ref);
  expect(H()).toBe(false);
});

test("makeHWeak: halts after T consecutive in-band iterations", () => {
  let activity = 0.5;
  const fakeSwarm = { getActivity: () => activity, agentCount: 10, getClusters: () => new Map() } as any;
  const H = makeHWeak(0.5, 0.1, 3, () => fakeSwarm);
  expect(H()).toBe(false);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
});

test("makeHWeak: resets counter when out of band", () => {
  let activity = 0.5;
  const fakeSwarm = { getActivity: () => activity, agentCount: 10, getClusters: () => new Map() } as any;
  const H = makeHWeak(0.5, 0.1, 3, () => fakeSwarm);
  H();
  H();
  activity = 0; // out of band
  expect(H()).toBe(false);
  activity = 0.5;
  expect(H()).toBe(false);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
});

test("makeHStrong: halts when largest cluster stays stable", () => {
  const swarm = initArraySwarm(4);
  swarm.agents[0] = { hyp: 5, active: true };
  swarm.agents[1] = { hyp: 5, active: true };
  swarm.agents[2] = { hyp: 5, active: true };
  let ref = swarm;
  const H = makeHStrong(0.75, 0.1, 2, () => ref);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
});

test("makeHStable: halts after minStableIterations consecutive stable iterations", () => {
  let activity = 0.5;
  const fakeSwarm = { getActivity: () => activity, agentCount: 10, getClusters: () => new Map() } as any;
  const H = makeHStable(10, 0.01, 3, () => fakeSwarm);
  expect(H()).toBe(false);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
});

test("makeHStable: resets stable counter when activity becomes unstable", () => {
  let activity = 0.5;
  const fakeSwarm = { getActivity: () => activity, agentCount: 10, getClusters: () => new Map() } as any;
  const H = makeHStable(10, 0.01, 3, () => fakeSwarm);
  H(); H(); // 2 stable iterations
  activity = 0; // inject noise to bust std dev
  activity = 1;
  H(); // now memory has [0.5, 0.5, 1.0] — std dev > 0.01 → reset
  activity = 0.5;
  expect(H()).toBe(false); // counter restarted
});

test("HAnd: halts only when all functions halt", () => {
  let a = false;
  let b = false;
  const H = HAnd(() => a, () => b);
  expect(H()).toBe(false);
  a = true;
  expect(H()).toBe(false);
  b = true;
  expect(H()).toBe(true);
});

test("HOr: halts when any function halts", () => {
  let a = false;
  let b = false;
  const H = HOr(() => a, () => b);
  expect(H()).toBe(false);
  a = true;
  expect(H()).toBe(true);
});

test("HAnd/HOr compose correctly", () => {
  const never = () => false;
  const always = () => true;
  expect(HAnd(always, always)()).toBe(true);
  expect(HAnd(always, never)()).toBe(false);
  expect(HOr(never, always)()).toBe(true);
  expect(HOr(never, never)()).toBe(false);
});
