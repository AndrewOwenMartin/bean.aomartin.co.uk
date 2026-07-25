import { createFileRoute } from "@tanstack/react-router";
import StandardSdsSummary from "../../markdown/standard-sds-summary.mdx";

export const Route = createFileRoute("/standard-sds-summary")({
  component: () => <StandardSdsSummary />,
});
