import { createFileRoute } from "@tanstack/react-router";
import FutureWork from "../../markdown/future-work.mdx";

export const Route = createFileRoute("/future-work")({
  component: () => (
    <>
      <FutureWork />
    </>
  ),
});