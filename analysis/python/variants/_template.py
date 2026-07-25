"""Template derivation script, worked for standard SDS as a self-check.

Copy this file to e.g. variants/multi_diffusion.py, replace the evolution
function with the variant's, and re-run. Because this one reproduces known
thesis results (alpha_min = 1/(2-beta), zeta = 2(1-ln2)), it doubles as a
regression test for sds_common.py itself -- run it after touching that file.

Run from analysis/python/:
    ../.venv/bin/python -m variants._template
"""

import sympy as sp

from sds_common import alpha, beta, c_i, alpha_min_from_evolution, zeta_from_alpha_min, to_latex, write_ts

# One-step evolution function for standard SDS (thesis eq. 3.5).
evolution = c_i * (beta * c_i + 2 * alpha - alpha * c_i - alpha * beta)

alpha_min = alpha_min_from_evolution(evolution)
zeta = zeta_from_alpha_min(alpha_min)

# gamma (steady state, alpha > alpha_min): thesis eq. 3.16.
gamma = (alpha * (2 - beta) - 1) / (alpha - beta)

assert sp.simplify(alpha_min - 1 / (2 - beta)) == 0, f"alpha_min mismatch: {alpha_min}"
assert sp.nsimplify(zeta, [sp.log(2)]) == 2 * (1 - sp.log(2)), f"zeta mismatch: {zeta}"

print("evolution:", evolution)
print("alpha_min:", alpha_min)
print("zeta:", zeta, "≈", float(zeta))
print("gamma:", gamma)

out_path = write_ts(
    "_template.ts",
    {
        "EVOLUTION": to_latex(sp.Eq(sp.Symbol(r"\bar{c}_{i+1}"), evolution)),
        "ALPHA_MIN": to_latex(sp.Eq(sp.Symbol(r"\alpha_{min}"), alpha_min)),
        "ZETA": to_latex(sp.Eq(sp.Symbol("zeta"), zeta)),
        "GAMMA": to_latex(sp.Eq(sp.Symbol("gamma"), gamma)),
    },
)
print("wrote", out_path)
