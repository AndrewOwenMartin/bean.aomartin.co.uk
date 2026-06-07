import { createFileRoute } from "@tanstack/react-router";
import HypothesisMutation from "../../markdown/hypothesis-mutation.mdx";

export const Route = createFileRoute("/hypothesis-mutation")({
  component: () => <HypothesisMutation />,
});
