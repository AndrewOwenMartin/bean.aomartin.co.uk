import { createFileRoute } from "@tanstack/react-router";
import IntroToSds from "../../markdown/intro-to-sds.mdx";
import { DiffAnimMotion } from "diff-anim/DiffAnimMotion";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <IntroToSds />
      <h1>Diffusion Phase</h1>
      <DiffAnimMotion />
    </>
  ),
});
