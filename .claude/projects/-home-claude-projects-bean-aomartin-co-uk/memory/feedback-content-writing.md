---
name: feedback-content-writing
description: Editorial decisions and voice conventions for writing bean educational content
metadata:
  type: feedback
---

## Pseudocode

No inline comments in pseudocode — the algorithms are short enough to speak for themselves.

**Why:** Comments add noise; the educational prose around the algorithm does the explaining.

**How to apply:** Write clean pseudocode, explain each branch in surrounding prose.

## Framing diffusion actions

Frame diffusion actions as "calling DH()" (hypothesis randomisation) rather than "becoming inactive." Activity state is a T concern, not a D concern.

**Why:** Consistent with the D/T/I/H formalism. The agent selects a hypothesis in D; the test in T determines activity.

**How to apply:** When describing what happens when an agent gets bumped or finds nobody to recruit from, say "calls DH()" not "becomes inactive."

## It is always the polling agent that acts

In passive diffusion (standard) and its variants, only the polling agent changes. The polled agent is passive. Active diffusion (DACTIVE) examined the reverse and added complications.

**Why:** Design decision in the original algorithm. Naming ("passive diffusion") reflects this.

## Context-free vs context-sensitive: two equal peaks

Context-free does NOT maintain two equal clusters — it has the same winner-takes-all instability as standard SDS. The recruitment feedback still applies (larger cluster is polled more often).

Context-sensitive DOES maintain two equal stable clusters, because each cluster's attrition is self-contained — it only competes with itself.

**Why:** The global collision cap in context-free doesn't change the recruitment asymmetry. Context-sensitive's per-cluster cap does.

## Negative pressure

The collision mechanism in context-free creates "negative pressure" — attrition that scales directly with cluster size. This is distinct from test-failure attrition, which is per-agent and doesn't scale with cluster size.

**Why:** Key to explaining why context-free responds faster to dynamic search spaces (two mechanisms: more free agents + active erosion of old cluster).

## Equilibrium: four-way balance in context-free

Cluster equilibrium in context-free is determined by:
1. Agents leaving via collision (scales with cluster size / swarm size)
2. Agents leaving via test failure (scales with hypothesis quality P)
3. Agents arriving via recruitment (inactive agents polling cluster members)
4. Agents arriving via random DH() hits (background noise; includes bumped active agents)

Factors 1 and 4 are coupled: collision bumps agents into the DH pool. Recruitment (factor 3) is only available to inactive polling agents — active agents that poll another active call DH(), they don't copy.
