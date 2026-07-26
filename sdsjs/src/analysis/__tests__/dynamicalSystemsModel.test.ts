import { runDDSM, makeInitialState, alphaMin } from "../dynamicalSystemsModel";

// Thesis closed-form one-step evolution function, eq. 3.5.
const f = (alpha: number, beta: number, c: number): number =>
  c * (beta * c + 2 * alpha - alpha * c - alpha * beta);

// Thesis closed-form nonzero steady state.
const gamma = (alpha: number, beta: number): number =>
  (2 * alpha - 1 - alpha * beta) / (alpha - beta);

describe("DDSM", () => {
  it("keeps the state normalised to 1 every iteration", () => {
    const trajectory = runDDSM(0.8, 0.05, makeInitialState(0.01), 50);
    for (const state of trajectory) {
      const total =
        state.activeOptimal +
        state.inactiveOptimal +
        state.activeNoise +
        state.inactiveNoise;
      expect(total).toBeCloseTo(1, 10);
    }
  });

  it("collapses to zero when alpha is below alphaMin", () => {
    const beta = 0.05;
    const alpha = alphaMin(beta) - 0.01;
    const trajectory = runDDSM(alpha, beta, makeInitialState(0.01), 500);
    expect(trajectory[trajectory.length - 1].activeOptimal).toBeCloseTo(0, 6);
  });

  it("forms a stable nonzero cluster when alpha is above alphaMin, matching the closed-form steady state", () => {
    // Close to the boundary, convergence to the fixed point is slow, so this needs both
    // more iterations and a looser tolerance than cases further from alphaMin.
    const beta = 0.05;
    const alpha = alphaMin(beta) + 0.01;
    const trajectory = runDDSM(alpha, beta, makeInitialState(0.01), 5000);
    expect(trajectory[trajectory.length - 1].activeOptimal).toBeCloseTo(
      gamma(alpha, beta),
      3,
    );
  });

  it("reaches the same fixed point as the thesis closed form for a range of parameters", () => {
    const cases: Array<[number, number]> = [
      [0.8, 0.05],
      [0.6, 0.1],
      [0.95, 0.3],
    ];
    for (const [alpha, beta] of cases) {
      const trajectory = runDDSM(alpha, beta, makeInitialState(0.01), 1000);
      expect(trajectory[trajectory.length - 1].activeOptimal).toBeCloseTo(
        gamma(alpha, beta),
        6,
      );
    }
  });

  it("tracks the thesis closed form closely throughout the run, not just at the fixed point", () => {
    // The closed form reduces state to a single variable c by assuming a fixed ratio between
    // active and inactive mass at the optimal hypothesis. DDSMIterate keeps the full 4-cell
    // state and isn't on that manifold from a cold start, so exact agreement isn't expected —
    // but the two should stay close throughout, not just agree at the eventual fixed point.
    const alpha = 0.8;
    const beta = 0.05;
    let c = 0.01;
    const trajectory = runDDSM(alpha, beta, makeInitialState(0.01), 40).map(
      (s) => s.activeOptimal,
    );
    for (let i = 1; i < trajectory.length; i++) {
      c = f(alpha, beta, c);
      expect(Math.abs(trajectory[i] - c)).toBeLessThan(0.01);
    }
  });
});
