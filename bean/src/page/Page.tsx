import { useState, useEffect } from "react";
import Markdown from "react-markdown";
export const pages = import.meta.glob("/markdown/*.md", {
  query: "?raw",
  import: "default",
});

export const usePage = (init) => {
  const [page, setPage] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    init().then((newPage) => {
      setPage(newPage);
      setLoaded(true);
    });
  });

  return {
    page,
    loaded,
  };
};

export const Page = (props) => {
  const page = usePage(pages["/markdown/" + props.name]);
  return page.loaded ? (
    <Markdown>{page.page}</Markdown>
  ) : (
    <p>Loading {props.name}</p>
  );
};
