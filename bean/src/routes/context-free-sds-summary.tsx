import { createFileRoute } from "@tanstack/react-router";
import ContextFreeSdsSummary from "../../markdown/context-free-sds-summary.mdx";

export const Route = createFileRoute("/context-free-sds-summary")({
  component: () => <ContextFreeSdsSummary />,
});
