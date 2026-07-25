import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

export const MathComparison = () => (
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Standard SDS</th>
        <th>Context-free SDS</th>
        <th>Context-sensitive SDS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <InlineMath math="\bar{c}_{i+1}" />
        </td>
        <td>
          <InlineMath math="\bar{c}_{i}(\beta \bar{c}_{i} + 2\alpha - \alpha \bar{c}_{i} - \alpha\beta)" />
        </td>
        <td>
          <InlineMath math="\bar{c}_{i}[2\alpha(1-\beta)]-{\bar{c}_{i}}^{2}[2(\alpha-\beta)]" />
        </td>
        <td>
          <InlineMath math="\bar{c}_{i}[\alpha(2-\beta)]-{\bar{c}_{i}}^{2}(2\alpha-\beta)" />
        </td>
      </tr>
      <tr>
        <td>
          <InlineMath math="\alpha_{\text{min}}" />
        </td>
        <td>
          <InlineMath math="\dfrac{1}{2 - \beta}" />
        </td>
        <td>
          <InlineMath math="\dfrac{1}{2(1 - \beta)}" />
        </td>
        <td>
          <InlineMath math="\dfrac{1}{2 - \beta}" />
        </td>
      </tr>
      <tr>
        <td>
          <InlineMath math="\zeta" />
        </td>
        <td>
          <InlineMath math="2(1 - \ln 2) \approx 0.614" />
        </td>
        <td>
          <InlineMath math="1 - \ln 2 \approx 0.307" />
        </td>
        <td>
          <InlineMath math="2(1 - \ln 2) \approx 0.614" />
        </td>
      </tr>
      <tr>
        <td>
          <InlineMath math="\gamma" />
        </td>
        <td>
          <InlineMath math="\dfrac{\alpha(2-\beta)-1}{\alpha - \beta}" />
        </td>
        <td>
          <InlineMath math="\dfrac{2\alpha(1-\beta)-1}{2(\alpha - \beta)}" />
        </td>
        <td>
          <InlineMath math="\dfrac{\alpha(2-\beta)-1}{2(\alpha - \beta)}" />
        </td>
      </tr>
    </tbody>
  </table>
);
