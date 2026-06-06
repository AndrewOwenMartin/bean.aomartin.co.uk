Status: ready-for-agent

# PRD: Swarm `forAll` abstraction and ISynchronous fix

## Problem Statement

`ISynchronous` currently calls `swarm.agents.map(...)` and returns `Agent[]` — not a `Swarm`. This hardcodes the array representation into what should be a representation-agnostic function, and breaks the return type contract of the I function in the D/T/I/H taxonomy. As a result, `HashSwarm` cannot use `ISynchronous` at all, and the SDS loop (`SDS(I, H, swarm)`) cannot work correctly since `I` is supposed to return a `Swarm`.

## Solution

Add a `forAll` method to the `Swarm` interface. `forAll` is the representation-agnostic equivalent of `Array.map` — it applies a transformation to every agent and returns a new `Swarm` of the same concrete type. `ISynchronous` is then rewritten to use `forAll`, making it a clean one-liner that works with any swarm representation.

The `agents` property is removed from the public `Swarm` interface entirely — it becomes a private implementation detail of each concrete swarm type. Callers that need to inspect agents (e.g. the cluster analysis and tests) access them through the concrete type, not the interface.

## User Stories

1. As a library developer, I want `ISynchronous` to return a `Swarm`, so that it satisfies the I function contract in the D/T/I/H taxonomy.
2. As a library developer, I want `ISynchronous` to call `swarm.forAll` rather than `swarm.agents.map`, so that it works with any swarm representation without modification.
3. As a library developer, I want the `Swarm` interface to not expose `agents`, so that callers cannot depend on the internal representation.
4. As a library developer, I want `ArraySwarm.forAll` to apply a function to each agent and return a new `ArraySwarm`, so that the array representation is fully encapsulated.
5. As a library developer, I want `ISynchronous` to remain a pure function of `(D, T, swarm) => Swarm` with no additional parameters, so that it composes cleanly with `SDS`.
6. As a future implementer of `HashSwarm`, I want the `Swarm` interface to define `forAll` so that I have a clear contract to implement, separate from the array-specific iteration logic.

## Implementation Decisions

- The `Swarm` interface gains one new method: `forAll: (f: (agent: Agent) => Agent) => Swarm`. Combined with the existing `poll` and `agentCount`, this is the complete public interface.
- `agents` is removed from the `Swarm` interface. It remains as a concrete property on `ArraySwarm` and `HashSwarm` for internal use.
- `ArraySwarm.forAll` maps over the internal agents array and returns a new `ArraySwarm` with the transformed agents.
- `ISynchronous` becomes: `swarm.forAll(agent => T(D(agent, swarm)))`.
- Any code that currently accesses `swarm.agents` outside of the swarm construction functions should be updated to use the concrete type (`ArraySwarm`) explicitly, or refactored to go through `forAll`/`poll`.
- `HashSwarm.forAll` is out of scope — `HashSwarm` remains WIP and incomplete.

## Testing Decisions

Tests should verify the observable behaviour of `ISynchronous` via the full SDS algorithm — not the internal structure of the swarm. The existing integration test ("sds standard") that runs SDSStandard over a known search space and checks the dominant cluster is at the correct position is the best regression check.

Existing tests that access `swarm.agents` directly (e.g. to inspect agent state) may need to type-narrow to `ArraySwarm` or be deleted if they were testing implementation details rather than outcomes. Prefer deletion over contortion — the integration test is more valuable than unit tests that encode the old broken shape.

## Out of Scope

- `HashSwarm.forAll` implementation — HashSwarm remains WIP.
- Any changes to D, T, or H functions.
- Changes to `bean`.

## Further Notes

This change is a prerequisite for the npm workspaces task — `bean` should not depend on `sdsjs` until `sdsjs` exports a correct interface.
