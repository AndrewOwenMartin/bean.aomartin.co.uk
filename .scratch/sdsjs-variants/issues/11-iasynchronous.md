Status: wontfix

# 11: IAsynchronous — asynchronous iteration

## Problem

Asynchronous iteration is not implemented. In synchronous iteration, diffusion runs on the entire swarm simultaneously, then testing runs on the entire swarm. In asynchronous iteration, each agent performs its own diffusion then testing in sequence — so agent k+1 sees the result of agent k's actions.

## Thesis reference

Algorithm 12 (IASYNCHRONOUS), section 3.4.1.1.

## Design constraint

The current `Swarm.forAll` applies a transform to every agent simultaneously and returns a new swarm. It does not support sequential update where later agents see earlier agents' effects. `IAsynchronous` cannot be implemented using `forAll` alone.

## Design options

**Option A: Swarm.reduce / foldLeft**

Add a sequential fold method to the `Swarm` interface:
```ts
interface Swarm {
  reduce: <T>(f: (acc: T, agent: Agent) => T, init: T) => T;
}
```

`IAsynchronous` would fold, accumulating a new swarm:
```ts
export const IAsynchronous = (D, T, swarm) => {
  return swarm.reduce((currentSwarm, agent) => {
    const newHyp = D(agent, currentSwarm);
    const newAgent = T(newHyp, currentSwarm);
    return currentSwarm.forAll(a => a === agent ? newAgent : a); // identity comparison is wrong for value objects
  }, swarm);
};
```

Identity comparison on `Agent` objects is problematic in an immutable model.

**Option B: Operate on ArraySwarm.agents directly**

`IAsynchronous` accepts `ArraySwarm` explicitly (not `Swarm`):
```ts
export const IAsynchronous = (D: Diffusion, T: Testing, swarm: ArraySwarm): ArraySwarm => {
  let agents = [...swarm.agents];
  for (let i = 0; i < agents.length; i++) {
    const currentSwarm = makeArraySwarm(agents); // need makeArraySwarm exported or factored
    const newHyp = D(agents[i], currentSwarm);
    agents[i] = T(newHyp, currentSwarm);
  }
  return makeArraySwarm(agents);
};
```

This breaks representation-agnosticism but is practical for the array case. HashSwarm would need its own IAsynchronous.

**Option C: Add Swarm.scan**

A scan method that threads state through each agent:
```ts
interface Swarm {
  scan: (f: (swarm: Swarm, agent: Agent) => [Swarm, Agent]) => Swarm;
}
```

This is cleaner than reduce but still requires an interface change.

## Recommendation

Option B for now. The swarm-forall ticket already noted HashSwarm.forAll is not yet implemented. IAsynchronous can be `ArraySwarm`-specific and an issue opened to revisit when HashSwarm is fully implemented. Document this clearly in the function's JSDoc or a comment.

## Depends on

Issue 02 (T type change).

## Comments

Closed: implemented. Solution was Option D (not listed above): add `iter(): Iterable<Agent>` and `replace(old, next): Swarm` to the `Swarm` interface, implemented on `ArraySwarm` (HashSwarm gets throwing stubs). `IAsynchronous` iterates the original agent list via `swarm.iter()` and threads `current` through `replace` calls, so each D invocation sees all prior updates. Fully representation-agnostic. Implemented in `sdsjs/src/immutable/iteration.ts`, exported from `index.ts`.
