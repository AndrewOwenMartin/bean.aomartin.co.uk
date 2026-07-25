# Standard SDS: DDSM results (baseline)

Cleaned restatement of `thesis/003.2-mathematical-analysis-of-sds.md`.

## Assumptions

- Exactly one hypothesis has a score higher than all others (the **optimal hypothesis**).
- All other hypotheses' collective effect is modelled as a single value, **homogeneous
  background noise**.
- $S$ — search space size. $A$ — swarm size.

## DDSM notation

| symbol      | meaning                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| $\alpha$    | score of the optimal hypothesis                                                             |
| $\beta$     | mean probability of an agent at any non-optimal hypothesis becoming active                  |
| $\bar{c}_i$ | mean proportion of the population that are active agents maintaining the optimal hypothesis |

Constraint: $0 \le \beta < \alpha \le 1$.

Derived proportions (Figure 3.1 in the thesis):

| population                      | proportion                                            |
| ------------------------------- | ----------------------------------------------------- |
| active, at optimal hypothesis   | $\bar{c}_i$                                           |
| inactive, at optimal hypothesis | $\dfrac{1-\alpha}{\alpha}\bar{c}_i$                   |
| active, at a noise hypothesis   | $\beta\left(1 - \dfrac{\bar{c}_i}{\alpha}\right)$     |
| inactive, at a noise hypothesis | $(1-\beta)\left(1 - \dfrac{\bar{c}_i}{\alpha}\right)$ |

## One-step evolution function

Mean number of inactive agents adopting the optimal hypothesis per iteration during diffusion:

$$g(\alpha,\beta,\bar{c}_i) = \frac{1-\alpha}{\alpha}\bar{c}_i + (1-\beta)\left(1-\frac{\bar{c}_i}{\alpha}\right)$$

One-step evolution of $\bar{c}_i$:

$$\bar{c}_{i+1} = f(\alpha,\beta,\bar{c}_i) = \alpha\left(\bar{c}_i + g(\bar{c}_i,\alpha,\beta)\,\bar{c}_i\right) = \bar{c}_i\left(\beta\bar{c}_i + 2\alpha - \alpha\bar{c}_i - \alpha\beta\right)$$

## Minimum convergence criterion

Convergence requires $\left.\frac{df}{d\bar{c}_i}\right|_{\bar{c}_i=0} > 1$, giving:

$$\alpha_{\min} = \frac{1}{2-\beta}$$

Confirmed experimentally to within ±0.01 [60]. A simpler Markov-chain bound (ignoring $\beta$,
assuming $p_\alpha$ small) gives $\alpha \ge \tfrac{1}{2}$.

## Robustness

Proportion of valid $(\alpha,\beta)$ search spaces ($\beta < \alpha$) for which standard SDS
converges ($\alpha > \alpha_{\min}$):

$$\zeta = 2(1-\ln 2) \approx 0.614 \quad [62,\ \text{p.}54]$$

## Convergence time

Three phases: time-to-first-hit, cluster formation (positive feedback, fast), stability of the
converged state (practically indefinite).

**Time to first hit** ($\beta=0$):

$$T_H = A\ln\left(\frac{\ln(1-p)}{S}\right)^{-1}$$

**Time to first hit** ($\beta>0$), linear in $S$:

$$T_H = S\,\frac{\ln\frac{1}{p}}{A(1-\beta)^2}$$

**Geometric rate of convergence** (via DDSM):

$$\alpha(2-\beta)$$

**Strong convergence criterion**: if $\beta=0$, $\alpha=1$, and at least one agent maintains the
optimal hypothesis, the probability that all agents converge on it approaches 1. For $\alpha<1$,
SDS only weakly converges (statistically stable, not absorbing) — useful for non-stationary
search spaces since an apparently stable cluster collapses once a superior hypothesis appears.

## Steady state

For $\beta=0$, $\alpha<1$: mean active-agent count $E[n] = A\pi_1$, standard deviation
$\sigma = \sqrt{A\pi_1\pi_2}$, where

$$\pi_1 = \frac{\pi_3 - 1 + \sqrt{\left(\pi_3-1\right)^2 + 2\pi_3\left(1-\beta\right)p_\alpha}}{\pi_3}$$
$$\pi_2 = \frac{1 - \sqrt{\left(\pi_3-1\right)^2 + 2\pi_3\left(1-\beta\right)p_\alpha}}{\pi_3}$$
$$\pi_3 = 2\alpha\left(1-p_\alpha\right)$$

or $\alpha > \alpha_{\min}$, general mean stationary state:

$$\gamma = \frac{\alpha\left(2-\beta\right) - 1}{\alpha - \beta}$$

## Estimating α from steady state

From the largest cluster alone:

$$\hat\alpha = \frac{c_{\text{active}}}{c_{\text{active}} + c_{\text{inactive}}}$$

From global activity $\gamma'$ (noise-independent):

$$\gamma' = 2 - \frac{1}{\alpha} \quad\Rightarrow\quad \hat\alpha = \frac{1}{2-\hat\gamma}$$