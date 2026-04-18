import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export const Inline = () => {
  return <InlineMath>\int_0^\infty x^2 dx</InlineMath>;
};

export const Block = () => {
  return <BlockMath>\int_0^\infty x^2 dx</BlockMath>;
};

export const MathExample = (props) => {
  return <BlockMath>{props.children}</BlockMath>;
};
