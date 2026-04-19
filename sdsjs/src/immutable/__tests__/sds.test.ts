import { initSwarm } from "../../shared/swarm";
import { Microtest } from "../../shared/type";
import { countClusters} from "../../analysis/clusters";
import {
  SDSStandard,
  DHUniform,
  TMUniform,
  DPassive,
  TBoolean,
  makeHFixed,
} from "../sds";

test("DHUniform 1 returns zero", () => {
  expect(DHUniform(1)).toBe(0);
});

test("TMUniform with one element returns that element", () => {
  const microtest = () => false;
  expect(TMUniform([microtest])).toBe(microtest);
});

test("DPassive with active agent", () => {
  const agent = { active: true, hyp: 0 };
  expect(DPassive(undefined, agent, [])).toBe(agent);
});

test("DPassive with inactive agent and active polled agent", () => {
  const agent = { active: false, hyp: 0 };
  const polled = { active: true, hyp: 1 };
  expect(DPassive(undefined, agent, [polled])).toEqual({
    active: false,
    hyp: 1,
  });
});

test("DPassive with inactive agent and inactive polled agent", () => {
  const agent = { active: false, hyp: 0 };
  const polled = { active: false, hyp: 1 };
  const DH = () => 2;
  expect(DPassive(DH, agent, [polled])).toEqual({ active: false, hyp: 2 });
});

test("DBoolean with passing test", () => {
  const agent = { active: false, hyp: 1 };
  const TM = () => (hyp: number) => hyp === 1;
  expect(TBoolean(TM, agent)).toEqual({ active: true, hyp: 1 });
});

test("DBoolean with failing test", () => {
  const agent = { active: false, hyp: 1 };
  const TM = () => (hyp: number) => hyp === 0;
  expect(TBoolean(TM, agent)).toEqual({ active: false, hyp: 1 });
});

test("makeHFixed with 0 iterations", () => {
  const H = makeHFixed(0);
  expect(H()).toBe(true);
});

test("makeHFixed with 1 iteration", () => {
  const H = makeHFixed(1);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
});

test("makeHFixed with 3 iterations", () => {
  const H = makeHFixed(3);
  expect(H()).toBe(false);
  expect(H()).toBe(false);
  expect(H()).toBe(false);
  expect(H()).toBe(true);
  expect(H()).toBe(true);
  expect(H()).toBe(true);
});
test("init swarm", () => {
  const swarm = initSwarm(5);
  expect(swarm.length).toBe(5);
  expect(swarm[0]).toEqual({ hyp: 0, active: false });
});
test("sds standard", () => {
  const agentCount = 100;
  const mySearchSpace: string =
  // 0         10        20        30        40        50
  // 012345678901234567890123456789012345678901234567890123456789
    "xxxxxhexloworldakllajadsweklhheaekfjllkahelehlehlehlexxx";
  const model: string = "helloworld";

  const myMicrotests: Microtest[] = model
    .split("")
    .map((targetElement, index) => {
      return (hyp: number) => mySearchSpace[hyp + index] === targetElement;
    });

  const SDS = SDSStandard(mySearchSpace.length, myMicrotests);

  let swarm = initSwarm(agentCount);
  swarm = SDS(swarm);

  swarm.forEach((agent, index) => console.log({ index, agent }));

  const clusters = countClusters(swarm)

  expect(clusters['5']).toBeGreaterThan(clusters['inactive'])

  const clusterNames = Object.keys(clusters)
  const clusterSizes = Object.values(clusters)
  const optimalClusterLocation = clusterNames.indexOf('5')
  const optimalClusterSize = clusterSizes[optimalClusterLocation]
  expect(Math.max(...clusterSizes)).toEqual(optimalClusterSize)

});
