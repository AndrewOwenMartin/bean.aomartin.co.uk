import { createFileRoute } from "@tanstack/react-router";
import SdsStories from "../../markdown/sds-stories.mdx";

export const Route = createFileRoute("/stories")({
  component: () => <SdsStories />,
});
