# npm audit in this repo — what's going on and what to run

## `npm audit fix` vs `npm audit fix --force`

- **`npm audit fix`** only upgrades a package to a newer version that still satisfies
  the existing `^`/`~` range in `package.json` (e.g. `^9.39.4` can move to `9.40.0`,
  never `10.x`). It rewrites `package-lock.json` only. Nothing can jump a major
  version, so it can't break your build/config.
- **`npm audit fix --force`** drops that constraint. It installs whatever version
  actually clears the advisory, even across a major version bump, *and rewrites the
  `^` range in `package.json` to match*. Critically, npm's resolver doesn't only move
  forward — if it thinks an **older** major version happens to avoid the flagged
  dependency path, it will just as happily downgrade you to that, ignoring how old it
  is. That's exactly what it tries to do here (see below), which is why blindly
  running it is a bad idea.

I confirmed with a dry run that plain `npm audit fix` changes **nothing** in this
repo — every one of the 28 reported issues requires `--force`.

## It's really one advisory, not 28

Every flagged package traces back to a single advisory:
[`brace-expansion` DoS (GHSA-mh99-v99m-4gvg)](https://github.com/advisories/GHSA-mh99-v99m-4gvg) —
an unbounded-expansion crash (CWE-400/770), CVSS 7.5, availability-only impact (no
confidentiality/integrity loss). Fixed in `brace-expansion@5.0.8`; every version
`<=5.0.7` is flagged.

It appears twice in the tree, both times **transitively, in devDependencies only**:

- `bean`: `eslint@9.39.5 → minimatch@3.1.5 → brace-expansion@1.1.16`
- `sdsjs`: `jest@30.4.2 → @jest/reporters → glob@10.5.0 → minimatch@9.0.9 → brace-expansion@2.1.2`

The other ~26 package names npm lists (jest, ts-jest, vite, stylus,
`@vitejs/plugin-react`, `typescript-plugin-css-modules`...) aren't separately
vulnerable — they just depend on eslint/jest/minimatch/glob, so npm reports the whole
dependency chain as "affected."

**Real-world risk**: `brace-expansion`/`minimatch` here only ever processes your own
repo's file paths and lint/ignore patterns during `npm run lint` and `./test.sh` —
never untrusted/attacker-controlled input, and none of it ships to the deployed bean
site. This is low practical risk, not an emergency.

## What `--force` actually proposes (checked via dry run)

```
Updating eslint to 10.8.0                        — SemVer major, genuine forward fix
Updating typescript-plugin-css-modules to 2.3.0  — SemVer major, but this is a DOWNGRADE (current: 5.2.0)
Updating @vitejs/plugin-react to 5.2.0           — SemVer major, DOWNGRADE (current: 6.0.4), causes vite peer conflicts
Updating babel-jest to 23.6.0                    — SemVer major, DOWNGRADE (current: ~30.x)
Updating jest to 25.0.0                          — SemVer major, DOWNGRADE (current: 30.4.2, 5 majors back)
Updating ts-jest to 27.0.3                       — SemVer major, DOWNGRADE, conflicts with jest/typescript peers
No fix available for vite@>=7.0.0-beta.0
No fix available for @rolldown/plugin-babel@*
```

Only the **eslint bump is real** — eslint 9 → 10 pulls in `minimatch@^10.2.5`, which
depends on `brace-expansion@^5.0.5` (satisfied by the patched `5.0.8`). I checked: all
of bean's eslint plugins (`eslint-plugin-react-hooks@7.1.1`,
`eslint-plugin-react-refresh@0.5.3`, `typescript-eslint@8.65.0`) already declare eslint
10 as a supported peer, so the bump is clean at the dependency-resolution level (config
compatibility still needs a real `npm run lint` check afterward, since eslint 9→10 can
carry rule/config changes).

Everything else in that list is npm's resolver picking an old, unrelated major version
that happens not to include the flagged path — not a real fix. In particular:
**there is no jest fix available at all right now** — `30.4.2` is the current latest
release of jest, full stop, and the whole 30.x line still pins the old `glob`/
`minimatch`. The "fix" to jest 25.0.0 is npm grasping at straws, not a usable option.
Nothing to do there but wait for upstream jest to bump its own `glob` dependency.

## Separate, unrelated problem found along the way

Your installed `node_modules` is already out of sync with `package-lock.json`
(pre-existing, not caused by anything above — `npm audit` is read-only):

| package                          | package.json / lockfile want | actually installed |
|-----------------------------------|-------------------------------|---------------------|
| `@vitejs/plugin-react`            | `6.0.4`                       | `5.2.0` (npm flags this `invalid`) |
| `typescript-plugin-css-modules`   | `5.2.0`                       | `2.3.0` (npm flags this `invalid`) |

A plain `npm install` resyncs these to what's already declared/locked — no version
range or lockfile changes, just repairing the on-disk install.

## Commands to run

```bash
# 1. Fix the stale/invalid install first (unrelated to the CVE, but should happen anyway)
npm install

# 2. Confirm the current audit state now that the install is clean
npm audit

# 3. The one real, non-downgrade fix: bump eslint in bean from 9 -> 10.
#    (This is the only package where a newer major genuinely resolves the advisory
#    without regressing anything. Everything else --force offers is a downgrade —
#    skipped, including the jest -> 25.0.0 regression.)
npm install --save-dev eslint@^10.8.0 @eslint/js@^10.0.1 -w bean

# 4. Verify nothing broke
npm run lint -w bean
npm run build -w bean

# 5. Re-check audit — bean's copy of the advisory should be gone; sdsjs's jest-based
#    one will remain until jest itself ships a fix upstream (no action available today)
npm audit
```
