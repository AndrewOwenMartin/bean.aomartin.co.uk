# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo structure

Monorepo with two packages linked via npm workspaces:

- `sdsjs/` — TypeScript library implementing SDS algorithms. Primary deliverable. CommonJS, tested with Jest.
- `bean/` — React 19 + Vite educational website consuming `sdsjs`. Hosted at bean.aomartin.co.uk.
- `thesis/` — Markdown thesis documents (reference only, not built).

`bean` imports `sdsjs` as a workspace dependency (`import { SDSStandard } from 'sds'`). It does not reimplement SDS logic.

## Environment

The `claude` user on the dev machine uses [volta](https://volta.sh) to manage Node — this is what puts `node`, `npm`, and `npx` on PATH in non-login shells. It is not a project dependency; any Node installation works.

## Commands

### sdsjs

```bash
cd sdsjs
./test.sh                                             # jest (all tests) — use this, not npm test directly
./test.sh src/immutable/__tests__/sds.test.ts         # single test file
npm run build                                         # tsc
npm run lint                                          # prettier then eslint
```

`test.sh` uses `npx jest` directly when a path is given, so the hardcoded `./src` glob in the npm script doesn't swallow the argument. Always use it instead of calling `npm test` directly.

### bean

```bash
cd bean
npm run dev        # dev server with HMR
npm run build      # tsc + vite build
npm run lint       # eslint
```

Deploy: run `./build.sh` as amartin, then `../deploy.sh` as root.

## Architecture

See `CONTEXT-MAP.md` for domain context per package. Key points:

**The D/T/I/H taxonomy** — SDS is formally decomposed into Diffusion, Test, Iteration, and Halting functions. The prefix letters in function names (`DPassive`, `TBoolean`, `ISynchronous`, `makeHFixed`) are load-bearing — they indicate which part of the taxonomy the function belongs to. If a variant cannot be described in these terms, it is not SDS.

**Swarm interface** — `Swarm` exposes `poll`, `forAll`, and `agentCount`. The `forAll(f)` method is the abstract equivalent of array map — it applies a transformation to every agent and returns a new `Swarm`. This keeps `ISynchronous` representation-agnostic. `agents` is not part of the public interface.

**Two swarm representations** — `immutable/` (ArraySwarm, complete) and `hashmap/` (HashSwarm using `Map<Hyp,count>`, WIP). D and T are representation-agnostic; only I needs per-swarm implementations. Comparing the two representations is a research goal.

**bean content** — pages are MDX files (markdown + embedded React components). Animations are separate purpose-built components; global behaviour uses line charts, individual behaviour shows agents as visible entities. The library has no animation-specific design — animations call library functions directly.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/` in this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical label strings (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context repo: `CONTEXT-MAP.md` at root points to `sdsjs/CONTEXT.md` and `bean/CONTEXT.md`. See `docs/agents/domain.md`.
