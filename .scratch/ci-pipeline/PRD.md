Status: ready-for-human

# PRD: CI pipeline on GitHub Actions

## Problem Statement

Deployment is two manual shell commands run as two different users. There's no automated check that the build and tests pass before code reaches the server. A broken `tsc` or failing sdsjs test can go live undetected.

## Solution

A GitHub Actions workflow that runs on every push to `main`: install dependencies, run `sdsjs` tests, run `bean` typecheck. Failures block the push from being considered "green" without blocking the deploy itself (deploy remains manual for now).

## Out of Scope

Automated deployment. That requires secrets and server access setup and is a separate decision.

## Implementation Notes

`.github/workflows/ci.yml`:

```yaml
on: [push]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: cd sdsjs && ./test.sh
      - run: cd bean && npm run build
```

`npm ci` at the root installs all workspaces in one pass. The `sdsjs` test script and `bean` build both run from their own directories per the CLAUDE.md conventions.

## Open question

The repo needs to be on GitHub (or the workflow adapted for another host). Confirm the remote before starting.
