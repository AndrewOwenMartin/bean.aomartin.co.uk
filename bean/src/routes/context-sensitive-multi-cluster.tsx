import { createFileRoute } from "@tanstack/react-router";
import ContextSensitiveMultiCluster from "../../markdown/context-sensitive-multi-cluster.mdx";

export const Route = createFileRoute("/context-sensitive-multi-cluster")({
  component: () => <ContextSensitiveMultiCluster />,
});
