import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/">Intro</Link>
        <Link to="/stories">Stories</Link>
        <Link to="/future-work">Future Work</Link>
      </nav>
      <Outlet />
    </>
  ),
});
