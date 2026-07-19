import { createFileRoute } from '@tanstack/react-router'
import DDSM from "../../markdown/ddsm.mdx";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

export const Route = createFileRoute('/ddsm')({
  component: () => <>
  <DDSM /><div><h1>Foo</h1>
<InlineMath math="\bar{c}_{i+1}" />
  </div></>,
})

