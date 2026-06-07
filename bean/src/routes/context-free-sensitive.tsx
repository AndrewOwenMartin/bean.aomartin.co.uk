import { createFileRoute } from "@tanstack/react-router";
import ContextFreeSensitive from "../../markdown/context-free-sensitive.mdx";

export const Route = createFileRoute("/context-free-sensitive")({
  component: () => <ContextFreeSensitive />,
});
