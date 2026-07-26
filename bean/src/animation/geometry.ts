import { listReducer } from "../hooks/useList";

export const SVG_W = 400;
export const SVG_H = 200;
export const PAD = 40;
export const BASELINE_Y = 155;
export const R = 12;
export const STACK_GAP = 28;

export const slotX = (slotCount: number): number[] =>
  Array.from(
    { length: slotCount },
    (_, i) => PAD + (i * (SVG_W - 2 * PAD)) / (slotCount - 1),
  );

export interface SlotPos {
  x: number;
  y: number;
}

export const computeSlotPositions = (
  slotOf: number[],
  slotCount: number,
): SlotPos[] => {
  const xs = slotX(slotCount);
  const stacks: number[][] = Array.from({ length: slotCount }, () => []);
  slotOf.forEach(
    (slot, i) =>
      (stacks[slot] = listReducer(stacks[slot]!, {
        type: "set",
        newList: [i, ...stacks[slot]!],
      })),
  );
  return slotOf.map((slot, i) => ({
    x: xs[slot]!,
    y: BASELINE_Y - R - stacks[slot]!.indexOf(i) * STACK_GAP,
  }));
};
