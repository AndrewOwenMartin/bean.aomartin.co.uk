import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/">Intro</Link>
        <Link to="/stories">Stories</Link>
        <Link to="/future-work">Future Work</Link>
        <Link to="/hypothesis-mutation">Hypothesis Mutation</Link>
        <Link to="/context-free-sensitive">Context Free & Sensitive</Link>
      </nav>
      <Outlet />
    </>
  ),
});
