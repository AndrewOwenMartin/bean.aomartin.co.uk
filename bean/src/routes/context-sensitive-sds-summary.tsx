import { createFileRoute } from "@tanstack/react-router";
import ContextSensitiveSdsSummary from "../../markdown/context-sensitive-sds-summary.mdx";

export const Route = createFileRoute("/context-sensitive-sds-summary")({
  component: () => <ContextSensitiveSdsSummary />,
});
