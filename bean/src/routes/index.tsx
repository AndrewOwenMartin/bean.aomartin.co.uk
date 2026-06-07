import { createFileRoute } from "@tanstack/react-router";
import { DiffAnim } from "../diff-anim/DiffAnim";
import IntroToSds from "../../markdown/intro-to-sds.mdx";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <IntroToSds />
      <h1>Diffusion Phase</h1>
      <DiffAnim />
    </>
  ),
});
