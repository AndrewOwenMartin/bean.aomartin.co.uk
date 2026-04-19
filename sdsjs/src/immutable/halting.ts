export const makeHFixed = (maxIterations: number) => {
  let iterationCount = 0;
  function HFixed() {
    iterationCount += 1;
    return iterationCount > maxIterations;
  }
  return HFixed;
};
