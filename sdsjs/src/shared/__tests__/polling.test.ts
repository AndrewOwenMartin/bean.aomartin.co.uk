import { describe, expect, jest, test } from "@jest/globals";
import { hashPollWithMaps } from "../../immutable/polling";
import * as polling from "../../immutable/polling";
import { Clusters, Hyp } from "../type";

describe("hashPollWithMaps works", () => {
  const clusters: Clusters = new Map([
    [1, 5],
    [2, 1],
  ]);
  const agentCount = 10;
  test("Returns first cluster when index is 0", () => {
    jest.spyOn(polling, "randInt").mockReturnValue(0);
    const agent = hashPollWithMaps(clusters, agentCount);
    expect(agent).toEqual({ hyp: 1, active: true });
  });
  test("Returns second cluster when index is 5", () => {
    jest.spyOn(polling, "randInt").mockReturnValue(5);
    const agent = hashPollWithMaps(clusters, agentCount);
    expect(agent).toEqual({ hyp: 2, active: true });
  });
  test("Returns inactive agent when index is 6", () => {
    jest.spyOn(polling, "randInt").mockReturnValue(6);
    const agent = hashPollWithMaps(clusters, agentCount);
    expect(agent).toEqual({ hyp: 0, active: false });
  });
});
