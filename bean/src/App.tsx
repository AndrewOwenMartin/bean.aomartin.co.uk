import React from "react";
import { DiffAnim } from "./diff-anim/DiffAnim";
import IntroToSds from "../markdown/intro-to-sds.mdx";
import SdsStories from "../markdown/sds-stories.mdx";
import FutureWork from "../markdown/future-work.mdx";

const MathComparison = React.lazy(() =>
  import("./MathComparison").then((m) => ({ default: m.MathComparison })),
);

function App() {
  return (
    <>
      <IntroToSds />
      <h1>Diffusion Phase</h1>
      <DiffAnim />
      <SdsStories />
      <FutureWork />
      <h1>Mathematical comparison</h1>
      <p>
        Comparison of the one step evolution function (c), minimum convergence criteria (a),
        robustness (z), and steady state (g) of Standard SDS, Context-free SDS and
        Context-sensitive SDS
      </p>
      <React.Suspense fallback={null}>
        <MathComparison />
      </React.Suspense>
    </>
  );
}

export default App;
