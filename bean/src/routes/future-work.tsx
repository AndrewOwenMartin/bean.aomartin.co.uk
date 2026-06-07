import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import FutureWork from "../../markdown/future-work.mdx";

const MathComparison = React.lazy(() =>
  import("../MathComparison").then((m) => ({ default: m.MathComparison })),
);

export const Route = createFileRoute("/future-work")({
  component: () => (
    <>
      <FutureWork />
      <h1>Mathematical comparison</h1>
      <p>
        Comparison of the one step evolution function (c), minimum convergence
        criteria (a), robustness (z), and steady state (g) of Standard SDS,
        Context-free SDS and Context-sensitive SDS
      </p>
      <React.Suspense fallback={null}>
        <MathComparison />
      </React.Suspense>
    </>
  ),
});
