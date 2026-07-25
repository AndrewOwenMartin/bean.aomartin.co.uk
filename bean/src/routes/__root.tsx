import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import styles from '../styles/card.module.css'

interface NavLink{
  url: string;
  label: string;
}

const links: NavLink[] = [
  {url: "/", label: "Intro"},
  {url: "/stories", label: "Stories"},
  {url: "/future-work", label: "Future Work"},
  {url: "/hypothesis-mutation", label: "Hypothesis Mutation"},
  {url: "/context-free-sensitive", label: "Context Free & Sensitive"},
  {url: "/ddsm", label: "DDSM"},
  {url: "/standard-sds-summary", label: "Standard SDS Summary"},
  {url: "/context-free-sds-summary", label: "Context-free SDS Summary"},
  {url: "/context-sensitive-sds-summary", label: "Context-sensitive SDS Summary"},
  {url: "/context-sensitive-multi-cluster", label: "Context-sensitive Multi-cluster"},
]

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
      <ul className={styles.navList}>
        {links.map((link) => <li key={link.url}><Link to={link.url}>{link.label}</Link></li>)}

        </ul>
      </nav>
      <Outlet />
    </>
  ),
});
