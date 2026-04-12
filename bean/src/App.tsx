import { DiffAnim } from "./diff-anim/DiffAnim";
import { pages, usePage, Page } from "./page/Page";

function App() {
  const intro = usePage(pages["/markdown/intro-to-sds.md"]);

  return (
    <>
      <Page name="intro-to-sds.md" />
      <h1>Diffusion Phase</h1>
      <DiffAnim />
    </>
  );
}

export default App;
