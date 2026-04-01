**Chapter 4**

## 4 Local termination criteria forSDS

This section details some investigations into the robustness of the distributed decision
making processes observed in ants and bees.SDSis used as a model of the distributed
decision making process as there are significant similarities. A variant ofSDSis introduced
which introduces the possibility for agents to switch behaviours in a manner similar to ants
switching their behaviours from tandem running to transporting, and bees switching their
behaviours from waggledancing to piping. The new behaviour is most analogous to the
transporting behaviour of ants as individual agents impose their decision on other agents,
effectively removing them from the search process. As this behaviour results in a decrease
in the number of agents in the swarm, the variant is called reducingSDS.

### 4.1 Introduction of reducingSDS

The key difference between reducingSDSand standardSDSis that a new behaviour is
introduced, to reflect the behavioural switch observed in migrating ants. This behaviour
removes other agents from the swarm. This effectively terminates the action of removed
agents, hence the new behaviour is named ‘terminating’. The terminating behaviour is
analogous to the transporting behaviour described in section 3.5.1 in that terminating agents
no longer evaluate their hypothesis and proceed to impose their decision on other agents in
the swarm. The most important factor in the method by which agents become terminating
is the cluster size at their hypothesis as population size at a candidate nest site was
determined to be the most important factor for ants (Section 3.5.4) and bees (Section 3.5.5).


The detection of population size at a candidate nest site by ants was determined to be
enabled though direct contact. Therefore agents commence terminating in reducingSDS
when an active agent polls another agent which maintains the same hypothesis, as this
is analogous to a chance encounter between two ants evaluating the same candidate nest
site. As ants which have commenced transporting perform no further evaluations of their
candidate nest site, agents which have commenced terminating perform no further action
during the test phase (Algorithm 33). Both boolean testing and ant nest site selection
appear to rely on a partial evaluation followed by a decision to continue evaluating the
same potential solution determined by whether the partial evaluation was satisfactory.
Therefore, no modifications were made to the mode of testing as boolean testing is already
an acceptable analogue of observed ant and bee behaviour. Instances of reducingSDShalt
once all agents have been removed from the swarm or once all agents are terminating, as
this state is analogous to the situation where all ants have been transported to a new nest
site (Algorithm 34). When a terminating agent removes another agent the removed agent
is considered to be permanently maintaining the hypothesis of the terminating agent. To
calculate the size of a cluster in reducingSDStherefore requires the summing of the number
of active agent maintaining a particular hypothesis plus the number of agents that were
removed by agents maintaining that hypothesis.

Two variants of reducingSDShave been developed and are detailed in the following
sections, both variants use the same mode of testing and the same mode of halting, these
are detailed in algorithms 33 and 34 respectively. Note thatTREDUCINGreceives a mode of
testing (T) as a parameter, this mode of testing is performed as usual, but only if the agent
is not terminating.

**Algorithm 33** TREDUCING— Reducing testing
1: **function** TREDUCING(T)
2: **function** T’(agent)
3: **if** agent is not terminating **then**
4: T(agent)
5: **return** T’


**Algorithm 34** HREDUCING— Empty or all terminating swarm halting
1: **function** HREDUCING(swarm)
2: **function** H’( )
3: empty←swarm size = 0 .empty∈ **B**
4: all terminating←all agents in swarm are terminating .all terminating∈ **B**
5: halt←emptyorall terminating .halt∈ **B**
6: **return** halt
7: **return** H’

### 4.2 Independent reducingSDS.

The first variant of reducingSDSto be developed is independent reducingSDS, its mode of
diffusion is intended to be as close an analogy of observed ant behaviour as possible within
the framework ofSDS. In independent reducing diffusion an agent polls another agent
from the swarm and performs one of five behaviours, each one represents a behaviour
observed in ant nest site selection.

1. If both agents are inactive each agent generates a new hypothesis. This is analogous
    to two ants neither of which have located a candidate nest site encountering each
    other and continuing to search in a random fashion.
2. If one agent is active and the other is inactive, the inactive agent assumes the hy-
    pothesis of the active agent. This is analogous to one ant leading another ant to a
    candidate nest site by tandem running.
3. If a terminating agent encounters another agent the other agent is removed from the
    swarm, if both agents are terminating the removed agent is chosen arbitrarily. This is
    analogous to one ant transporting another ant to a candidate nest site.
4. If both agents are active and maintaining the same hypothesis they both become
    terminating. This is analogous to two ants encountering each other at a candidate
    nest site and commencing transporting.

As with dual polling (a combination of passive polling and active polling, described in
section 3.4.2.2) both active and inactive agents take action during diffusion but unique to
independent reducingSDSboth the polled agent and the polling agent may change state.
Independent reducing diffusion is shown in algorithm 35.
One further feature of independent reducingSDSis that it implements asynchronous


**Algorithm 35** DINDEPENDENT— Independent reducing diffusion
1: **function** DINDEPENDENT(DH, swarm)
2: **function** D’(agent)
3: polled←random agent in swarm
4: **if** both agents are inactive **then**
5: hypothesis of agent←DH()
6: hypothesis of polled←DH()
7: **else if** one agent is inactiveandother is active but not terminating **then**
8: hypothesis of inactive agent←hypothesis of active agent
9: **else if** exactly one agent is terminating **then**
10: hypothesis of non-terminating agent←hypothesis of terminating agent
11: non-terminating agent is removed from the swarm
12: **else if** both agents are terminating **then**
13: arbitrarily chosen agent is removed from the swarm
14: hypothesis of removed agent←hypothesis of other agent
15: **else if** hypothesis of agent = hypothesis of polled **then**
16: both agents become terminating
17: **return** D’

```
iteration as it is a closer analogy to the action of individual ants, though as noted in
section 3.4.1.1 this is not expected to result in behaviour significantly different to that of
synchronous iteration. Independent reducingSDSmay therefore be denoted as
```
```
SDS
```
###### (

###### IASYNCHRONOUS(DINDEPENDENT(DHSTANDARD),TREDUCING(TSTANDARD)),HREDUCING

###### )

No claims are made that this procedure duplicates real world behaviour, other than to
posit that the requirements of an agent are broadly within the capacities of natural ants.
An agent only requires access to global state when polling another agent, which is taken
to be a fair analogy to a chance encounter between any two ants moving around in the
world. Similarly, the requirement that two agents are able to compare their hypotheses
for equality is taken to be a fair analogy to a pair of ants encountering each other whilst
evaluating the same nest. Furthermore, interaction is bi-directional, no distinction is made
between the polling and polled agent. When two terminating agents encounter each other,
the agent to be removed must be chosen randomly, though in this case both agents will be
functionally identical so which agent is chosen for removal is immaterial. This decision to
remove one agent, rather than both, is to maintain similarity with the behaviour of ants,
where one ant will transport the other to the new nest site.

Two experiments were performed to examine the stability of this algorithm, both employed
a model inspired by the DDSM which models search spaces with a two values representing


the optimal hypothesis score ( _α_ ) and homogeneous background noise ( _β_ ). While this model
appears restrictive it captures the characteristic behaviour of reducingSDSin the large
majority of cases. In any search space there will be a maximum value which represents
the score of the optimal hypothesis, it is possible that there are multiple hypotheses with
the same maximum score but these can be considered to be equivalent and convergence
to either hypothesis can be considered a success. In most search spaces there will also be
multiple hypotheses that are sub-optimal, the DDSM is based upon the observation that
the effect of these hypotheses can be modelled by a single value representing homogeneous
background noise [62]. In some search spaces there may also be a small number of
distractors, sub-optimal hypotheses with a score strong enough to form stable clusters
but still distinctly lower than that of the optimal hypothesis. While the DDSM does
not appear to model the effect of distractors directly, it can still be represented. In the
presence of distractors one of three cases my occur, i) a cluster begins to form at the optimal
hypothesis before the forming at a distractor, ii) a cluster begins to form at the distractor
before forming at the optimal hypothesis, iii) clusters form at the optimal hypothesis and
distractor simultaneously. The third case can be discounted as unlikely as the time taken for
an agent to assume specific hypothesis is much longer than the time taken for a cluster to
reach stability once it has begun to form. This is because cluster formation is best described
as rapid process dominated by a positive feedback loop [66], and hypothesis selection is
a process that acts in linear time with respect to the number of inactive agents over the
size of the search space. In the first case the effect of the distractor is small, a cluster will
form at the optimal hypothesis exactly as if the distractor did not exist as there will be
no active agents maintaining the distractor hypothesis. The only effect of the distractor is
that the stable cluster size at the optimal hypothesis may be negligibly smaller as the some
occasional activity at the distractor will effectively increase the amount of homogeneous
background noise otherwise present. In the second case the algorithm can be expected to
converge to the distractor at which point there will be a stable value for global activity. This
state, where a stable cluster has formed at a distractor and not the optimal hypothesis can
then be accurately modelled with an increase in the value of homogeneous background
noise such that the global activity caused by active agents at the noise hypothesis matches
the global activity of the algorithm after convergence to the distractor.


#### 4.2.1 Robustness of independent reducingSDS

The first experiment aimed to demonstrate the probability of independent reducingSDS
converging to the optimal hypothesis over a range of conditions which represented a
sample of all valid search spaces. An instance of Independent reducingSDSwas performed
with a swarm of 103 agents against search spaces of various size and with various values
for optimal hypothesis score and homogeneous background noise. The search space sizes
were 102 , 10^3 , 10^4 , 10^5 , and the values for _α_ and _β_ were every value in the interval[0, 1]
where _α_ > _β_ for a total of 55 unique search spaces. A search was performed on each
combination of _α_ , _β_ , and search space size, and each search was repeated 100 times. Each
search used a halting method which combined the reducing halting criteria (algorithm 34)
with fixed iteration count halting (algorithm 11),HOR(HREDUCING,HFIXED( 10001 )). Fixed
iteration count halting was used to avoid cases that would otherwise not halt within a
practical time.

After each halt the cluster sizes were analysed as follows:

- If the number of iterations was greater than or equal to 10001 the search was consid-
    ered a failure.
- If the search was not a failure and the largest cluster was at the optimal hypothesis
    the search was considered to have converged successfully.
- If the search was not a failure and the largest cluster was **not** at the optimal hypothesis
    the search was considered to have converged to a noise hypothesis.

##### 4.2.1.1 Results

```
Some results of this experiment are shown in Table 4.1. The full results for this experiment
are shown in Table A.2 (Section A.2, p.194).
```
The robustness of independent reducingSDSwas significantly affected by the search space
size. Successful convergences occurred in49.27%of all cases, occurring less frequently
in larger search spaces76.24%, 60.89%, 40.47%, 19.49%for search spaces of size 102 , 10^3 ,
104 , 10^5 respectively, a correlation of−0.85(P=0.1). Failed convergences occurred in
3.20%of all cases, occurring more frequently in larger search spaces0.00%, 1.82%, 4.29%,


```
S success P(success) noise P(noise) fail P(fail) total
102 4193 0.762 1307 0.238 0 0.0 5500
103 3349 0.609 2051 0.373 100 0.018 5500
104 2226 0.405 3038 0.552 236 0.043 5500
105 1072 0.195 4061 0.738 367 0.067 5500
```
Table 4.1: Robustness of independent reducingSDSwith varing search space size. Showing
search space size (S), the number of successes (success), convergences to noise hypotheses
(noise), and failures (fail), the probability of each result for a given search space size and
the total number of runs (total).

6.67%for search spaces of size 102 , 10^3 , 10^4 , 10^5 respectively, a correlation of0.85(P=0.2).
Convergences to noise solutions occurred in47.53%of all cases, occurring more frequently
in larger search spaces23.76%, 37.29%, 55.24%, 73.84%for search spaces of size 102 , 10^3 , 10^4 ,
105 respectively, a correlation of0.85(P=0.2). Correlations calculated using the Pearson
correlation coefficient for testing non-correlation [101,scipy.stats.pearsonr].

There was a significant difference in convergence between noiseless search spaces _β_ =
0, compared with noisy search spaces _β_ > 0. Out of the 18000 noisy search spaces,
7543 cases (41.91%) converged successfully, 0 cases were recorded as failures. The mean
average number of iterations before a successful convergence was30.63with a standard
deviation of30.18. Out of the 4000 noiseless search spaces there was a significantly higher
chance of successful convergence, with 3297 cases (82.42%) converging successfully. The
mean average number of iterations before a successful convergence in the noiseless case
was537.75with a standard deviation of1368.84. Welch’st-test for equal means [101,
scipy.stats.ttest_ind_from_stats] calculates the ratios of the means (t) to be21.27
P=3.5× 10 −^94 , showing that the convergence time between noiseless search spaces and
noisy search spaces to be significantly different.

These results show that independent reducingSDScan converge, but it is highly sensitive
to noise. The effect of noise is more pronounced in cases where the search space size (S)
is greater than the number of agents (A). This is expected as the probability of an agent
locating the optimal hypothesis is^1 −activityS and the probability of an agent maintaining a
noise hypothesis commencing terminating iscA _β_ wherec _β_ is the size of the cluster at the
noise hypothesis. In cases whereS>>Ait is expected that some agents will commence


```
terminating before a cluster forms at the optimal hypothesis so long as β >0. Furthermore,
there is a higher chance of a cluster forming earlier at the optimal hypothesis when α = 1
as there is no chance that the cluster will collapse once a single agent has assumed the
optimal hypothesis.
```
#### 4.2.2 Diffusion of termination in independent reducingSDS

While it has been shown that consensus is neither necessary or sufficient for quorum
sensing (Section 3.5.5), once some agents have sensed quorum it is essential that this is
communicated to the rest of the swarm to achieve consensus as soon as possible. This is to
reduce the number of agents which would otherwise perform further redundant evaluation,
and to avoid the case where other agents sense quorum at a separate hypothesis. The
second experiment therefore aimed to examine the time between a single agent locating
the optimal hypothesis and the process halting. This allows the convergence behaviour
to be examined separately from the effect of noise enabling simultaneous convergence to
other hypotheses.

As with the previous experiment, an instance of independent reducingSDSwas performed
with a swarm of 103 agents against every search space described by all the values for _α_ and
_β_ in the interval[0, 1]where _α_ > _β_. Each search was repeated 100 times. In a departure
from the previous experiment the search space size was not varied, instead the model
was modified to reflect a search space of infinite size. This was to ensure that the only
mechanism by which an agent could assume the optimal hypothesis was by being the agent
selected to initially maintain the optimal hypothesis or by receiving it via diffusion. Using
equation 3.8, the time to first hit (TH) in an infinite search space can be seen to be infinite,
therefore the mode of hypothesis selection employed (DHINFINITE) returned only the noise
hypothesis, this reduces the probability of an agent selecting the optimal hypothesis to zero,
and henceTH=∞. To enable the convergence behaviour to be examined a single agent
was initialised as active and maintaining the optimal hypothesis, furthermore only agents
which were maintaining the optimal hypothesis were allowed to become terminating. Each
search used a halting methodHOR(HREDUCING,HCOLLAPSE)which combined the reducing
halting criteria (algorithm 34) with a new halting method (algorithm 37) which halts if no
agents were maintaining the optimal hypothesis. StandardSDSwas also performed with
the sameDHbut halting withHFIXED( 1001 )to provide a comparison for the stability of


```
swarms.
```
**Algorithm 36** DHINFINITE— Noise hypothesis selection
1: **function** DHINFINITE
2: **function** DH’( )
3: **return** noise hypothesis
4: **return** DH’

**Algorithm 37** HCOLLAPSE— Optimal hypothesis cluster collapse halting
1: **function** HCOLLAPSE(swarm)
2: **function** H’( )
3: opt←number of active agents maintaining the optimal hypothesis
4: halt←opt= 0 .halt∈ **B**
5: **return** halt
6: **return** H’

After each halt the swarm was analysed as follows

- If no agents maintained the optimal hypothesis the search was considered a failure.
- If the search was not a failure the search was considered to have converged success-
    fully.

##### 4.2.2.1 Results

```
Independent reducingSDSwas shown to rapidly diffuse the detection of quorum through
the swarm in cases where the cluster did not collapse. The cluster did not collapse in
2482 out of 5500 cases (45%), and halted in an average of33.36iterations, with a standard
deviation of52.689. The probability of successfully halting was strongly correlated with α −
α min(the amount the optimal hypothesis score was greater than the minimum convergence
criteria for standardSDS), with a correlation of0.883(P=4.54× 10 −^19 ). The average
number of iterations before halting was strongly negatively correlated with α − α min, with a
correlation of−0.796(P=3.91× 10 −^11 ). The standard deviation of the number of iterations
before halting was moderately negatively correlated with the probability of successfully
halting, with a correlation of−0.581 (P=2.27× 10 −^5 )
```
The results for independent reducingSDSwere similar for standardSDSunder the same
conditions. As with independent reducingSDS, the probability of standardSDSsuccessfully
halting was strongly correlated with _α_ − _α_ min, with a correlation of0.890(P=1.04× 10 −^19 ).


```
Correlation P
α − α min SSDSc 0.890 1.04e-19
α − α min IrSDSc 0.883 4.54e-19
α − α min IrSDS μ -0.796 3.91e-11
IrSDSc SSDSc 0.978 8.60e-38
IrSDSc IrSDS σ -0.581 2.27e-05
```
Table 4.2: Correlations between the difference between _α_ and _α_ min, the count (subscriptc)
of successful convergences, mean average (subscript _μ_ ) and standard deviation (subscript
_σ_ ) of number of iterations before a successful convergence, for independent reducingSDS
(IrSDS) and standardSDS(SSDS).

```
Independent reducingSDSand standardSDSsuccessfully halted under silmilar conditions,
the correlation between the probability of independent reducingSDSsuccessfully halting
and the probability of standardSDSsuccessfully halting was 0.978 (P=8.60× 10 −^38 ).
```
These correlations are shown in table 4.2, the full results for this experiment are shown in
Table A.1 (Section A.1, p.191).

##### 4.2.2.2 Plot of swarm evolution

An instance of independent reducingSDSwas performed with a swarm of 103 agents
against a search space of size 10^4 where _α_ =0.75 and _β_ =0.125.

This plot helps demonstrate that the number of terminating agents decreases after an initial
increase. This occurs as although terminating agents may never stop terminating they
may be removed from the swarm altogether. Initially the number of agents becoming
terminating and the number of terminating agents being removed are both zero. Once a
cluster of active agents has formed, some agents become terminating but there are still few
terminating agents such that few terminating agents are being removed, hence the number
of terminating agents increases. Eventually the number of remaining agents which are
active but not terminating reduces and the number of terminating agents increases so the
number of agents commencing terminating equals the number of terminating agents being
removed, at this point the number of terminating agents is stable. Once the probability of a
terminating agent polling another terminating agent is greater than the probability of an


###### 0 5 10 15 20 25 30

Iteration

###### 0.0

###### 0.2

###### 0.4

###### 0.6

###### 0.8

###### 1.0

Proportion of swarm

```
Swarm size
Optimal active
Optimal terminating
Optimal removed
Noise active
```
###### 0 5 10 15 20 25 30

Iteration

###### 0.0

###### 0.2

###### 0.4

###### 0.6

###### 0.8

###### 1.0

Proportion of swarm

```
Optimal active
Optimal terminating
Noise active
```
Figure 4.1: Cluster size evolution over time for independent reducingSDS. Thex-axis
shows iterations. In the upper graph they-axis shows cluster size as a proportion of the
total number of agents, in the lower graph they-axis shows cluster size as a proportion of
the agents which have not yet been removed. The graphs show an accelerating growth in
the number of agents at the optimal hypothesis followed by a similar growth of terminating
agents at the optimal hypothesis until the entire swarm is terminating or removed.


```
active but not terminating agent polling an active agent the number of terminating agents
begins to decrease. Finally all agents are terminating or removed and the algorithm halts.
```
#### 4.2.3 Discussion

These experiments show that independent reducingSDSbehaves similar to standard
SDSin many ways. The conditions under which stable clusters may form is similar for
independent reducingSDSand standardSDSas seen in the strong correlations between the
conditions in which they do and do not exhibit cluster collapse. Once a cluster has formed
the behaviour of independent reducingSDSis similar to standardSDSwith a greedy halting
method, with independent reducingSDShalting on average after only33.36iterations after
the first agent became active. This greedyness can be seen as independent reducingSDS
halts in some cases where the conditions would not permit a stable cluster to form under
standardSDS, this may occurr as an agent remaining active for only a single iteration may
poll itself inDINDEPENDENTand become terminating. This behaviour leads to independent
reducingSDSbeing highly sensitive to the effect of homogeneous background noise in
cases whereS>> Aas even a small amount of activity is likely to cause an agent to
begin terminating before an agent assumes the optimal hypothesis. Independent reducing
SDScan therefore be described as being highly reliant on the optimal hypothesis being
located before any other moderately scoring hypothesis, this demonstrates that it cannot
reasonably be described as indirectly comparing hypotheses as has been observed in ant
nest site selection [28].

These features mean that independent reducingSDSmay be an impractical algorithm for all
cases other than those where any hypothesis that has a score greater than zero is considered
to be a suitable solution, and where the swarm size is at least as big as the search space size.
However, the feature for which independent reducingSDSwas developed was termination
using only local information, and this has been adequately demonstrated, the switch in
behaviour from evaluating to terminating diffuses rapidly through the swarm and within
a small number of iterations the entire swarm is either terminating or removed. This is
notable as independent reducingSDSuses individual actions which are inspired by natural
observations and arguably within the capacities of ants and bees. Furthermore the mode of
halting arises from individual actions, not an external algorithm which is also analogous
to that in ants. This process of detecting quorum and diffusing it through the swarm is


demonstrated to be feasible though highly greedy and sensitive to the probability of a
minimally acceptable candidate being located before the optimal. Mitigating the effect
of noise by introducing the requirement for multiple reinforcements of a hypothesis are
therefore be investigated in the next section.
Hypotheses are not being directly compared, as the process converges to the first hypothesis
which maintains a cluster long enough for a single agent to become active. Once an agent
is active the number of terminating agents increases monotonically at a rate proportional
to the number of terminating agents.

##### 4.2.3.1 Analogies with nature

```
In the natural case this implies that natural swarms will need to use a method more resistant
to the effect of noise if there is a significant probability of certain candidate nest sites not
being located.
Independent reducingSDSmodels recruiting as one agent copying the hypothesis of another
and transporting as one agent removing an agent from the swarm. Both of these actions can
be performed in a single iteration by two interacting agents, this ignores the observation
that transporting is three times faster than tandem running [29, 28, 77]. One way this could
be represented inDINDEPENDENTis by adding a random factor such that agents only copy
hypotheses in one in three cases, a feature similar toDHERMIT. Alternatively this could be
represented by adding a feature similar toDMULTI-DIFFUSIONfor terminating agents such that
they poll, and potentially remove, multiple agents from the swarm. These mechanisms
are likely to affect the range of search spaces in which reducingSDSwill converge, or the
speed thereof, but are not investigated here.
In independent reducingSDSterminating agents have the ability to remove other terminat-
ing agents, it is not clear from the referenced experiments whether this occurs in nature.
Even if it is a rare occurrence it is not clear whether this would be due to a decision of
the individual, or emergent form the fact that transporting agents spend less time at the
original nest and so are unlikely to be encountered for transporting.
```

### 4.3 Confirmation reducingSDS

As the aim of independent reducingSDSwas to develop a variant ofSDSwhich represent
the observed behaviour of ant nest site selection as closely as possible, it employs a mode
of diffusion that is unlike any previously modelled variant. A new variant is introduced
that aims to be as close as possible to standardSDSsuch that it may benefit from existing
models and intuition while also exhibiting the characteristic behaviours of independent
reducingSDS. The variant retains the behaviour of independent reducingSDSwhere agents
become terminating by a method where the quality of their hypothesis is confirmed by
contacting other agents in the same cluster, it is therefore named confirmation reducing
SDS.
Confirmation reducingSDSimplements the terminating and reducing effects of Indepen-
dent reducingSDSbut implements the synchronous iteration of standardSDSand a mode
of diffusion more closely related to passive diffusion. The diffusion behaviour includes the
behaviour of alias ofDPASSIVEwith the additional conditions that inactive agents may be
removed from the swarm and active agents may begin terminating. An active agent begins
terminating when the polled agent is also terminating and both agents share a hypothesis.
An inactive agent is removed from the swarm when they poll a terminating agent. The
mode of diffusion of confirmation reducingSDScan be seen in Algorithm 38.

**Algorithm 38** DCONFIRMATION— Confirmation reducing diffusion
1: **function** DCONFIRMATION(DH, swarm)
2: **function** D’(agent)
3: polled←random agent in swarm
4: **if** agent is active **then**
5: same hypotheses←hypothesis of agent = hypothesis of polled
6: **if** polled is activeandsame hypotheses **then**
7: agent becomes terminating
8: **else**
9: **if** polled is active **then**
10: **if** polled is terminating **then**
11: agent is removed from swarm
12: **else**
13: hypothesis agent←hypothesis of polled
14: **else**
15: hypothesis of agent←DH()
16: **return** D’


```
Confirmation reducingSDSmay be denoted as
```
```
SDS
```
###### (

###### ISYNCHRONOUS(DCONFIRMATION(DHSTANDARD),TREDUCING(TSTANDARD)),HREDUCING

###### )

As with independent reducingSDSthree experiments were performed. The first experiment
investigates the robustness of confirmation reducingSDSover various values for _α_ , _β_ and
S. The second experiment investigates the diffusion of the halting behaviour through the
swarm in the case where the termination behaviour is suppresed at any hypothesis other
than the optimal hypothesis. The third experiment plots the evolution of the swarm in an
example case of successful convergence.

#### 4.3.1 Robustness of confirmation reducingSDS

The first experiment aimed to demonstrate the probability of that the probability of con-
firmation reducingSDSconverging to the optimal hypothesis was similar to that of inde-
pendent reducingSDSover a range of conditions. As with the equivalent experiment for
independent reducingSDS, an instance of confirmation reducingSDSwas performed with
a swarm of 103 agents against search spaces of various size and with various values for
optimal hypothesis score and homogeneous background noise. The search space sizes were
102 , 10^3 , 10^4 , 10^5 , and the values for _α_ and _β_ were every value in the interval[0, 1]where
_α_ > _β_ for a total of 55 unique search spaces. A search was performed on each combination
of _α_ , _β_ , and search space size, and each search was repeated 100 times. Each search used
employed combined halting ofHOR(HREDUCING,HFIXED( 10001 )).

After each halt the cluster sizes were analysed as follows:

- If the number of iterations was greater than or equal to 10001 the search was consid-
    ered a failure.
- If the search was not a failure and the largest cluster was at the optimal hypothesis
    the search was considered to have converged successfully.
- If the search was not a failure and the largest cluster was **not** at the optimal hypothesis
    the search was considered to have converged to a noise hypothesis.


```
S success P(success) noise P(noise) fail P(fail) total
102 4866 0.885 634 0.115 0 0.0 5500
103 3981 0.724 1496 0.272 23 0.004 5500
104 2617 0.476 2676 0.487 207 0.038 5500
105 1104 0.201 4040 0.735 356 0.065 5500
```
Table 4.3: Robustness of confirmation reducingSDSwith varing search space size. Showing
search space size (S), the number of successes (success), convergences to noise hypotheses
(noise), and failures (fail), the probability of each result for a given search space size and
the total number of runs (total).

##### 4.3.1.1 Results

```
Some results of this experiment are shown in Table 4.3. The full results for this experiment
are shown in Table A.2 (Section A.2, p.194).
```
As with independent reducingSDS, the performance of confirmation reducingSDSwas
significantly affected by the search space size.

#### 4.3.2 Diffusion of termination in confirmation reducingSDS

The second experiment aimed to demonstrate that the diffusion of the termination be-
haviour in confirmation reducingSDSwas similar to that of independent reducingSDS.The
same experiment for independent reducingSDSwas performed with confirmation reducing
SDS, employingDHINFINITEand combined haltingHOR(HREDUCING,HCOLLAPSE).

##### 4.3.2.1 Results

There was a strong correlation0.987(P=9.30× 10 −^44 ) between the probability of confir-
mation reducingSDSsuccessfully converging and standardSDSsuccessfully converging.
There was also a strong correlation0.986(P=2.82× 10 −^43 ) between the probability of
confirmation reducingSDSsuccessfully converging and independent reducingSDSsuccess-
fully converging. The correlation between the probability of successful convergence and
the standard deviation of the number of iterations before halting was not strong, and with


```
Correlation P
α − α min SSDSc 0.890 1.04e-19
α − α min CrSDSc 0.906 1.75e-21
α − α min CrSDS μ -0.765 9.69e-11
CrSDSc SSDSc 0.987 9.30e-44
CrSDSc CrSDS σ -0.159 2.70e-01
CrSDSc IrSDSc 0.986 2.82e-43
```
Table 4.4: Correlations between the difference between _α_ and _α_ min, the count (subscriptc)
of successful convergences, mean average (subscript _μ_ ) and standard deviation (subscript
_σ_ ) of number of iterations before a successful convergence, for confirmation reducingSDS
(CrSDS), independent reducingSDS(IrSDS) and standardSDS(SSDS).

```
a poor P-value.
```
This is taken as evidence that confirmation reducingSDSbehaves in a was similar to both
standardSDSand independent reducingSDS.

##### 4.3.2.2 Plot of swarm evolution

An instance of Confirmation reducingSDSwas performed was a swarm of 103 agents
against a search space of size 10^4 where _α_ =0.75 and _β_ =0.125.

The plots of swarm evolution for confirmation reducingSDS(Figure 4.2) has some simi-
larities and some differences with independent reducingSDS(Figure 4.1). The upper plot
(which shows the states of agents as a proportion of the original swarm size) for both
confirmation reducingSDSand independent reducingSDSshows swarm size decreasing in
the shape of an S-curve, the proportion of removed agents increasing in the shape of an
S-curve, and the proportion of agents at noise solutions as initialy stable and then reducing
to zero. There is less agreement between the evolution of the proportion of agents active at
the optimal hypothesis and the proportion of agents which are terminating. In independent
reducingSDSthese proportions eventually reach zero whereas under confirmation reducing
SDSthese proportions stabilise between0.2and0.4. This difference occurs because only
inactive agents may be removed from the swarm under confirmation reducingSDSwhereas
any agent may be removed from the swarm in independent reducingSDS.


###### 0 5 10 15 20 25 30

Iteration

###### 0.0

###### 0.2

###### 0.4

###### 0.6

###### 0.8

###### 1.0

Proportion of swarm

```
Swarm size
Optimal active
Optimal terminating
Optimal removed
Noise active
```
###### 0 5 10 15 20 25 30

Iteration

###### 0.0

###### 0.2

###### 0.4

###### 0.6

###### 0.8

###### 1.0

Proportion of swarm

```
Optimal active
Optimal terminating
Noise active
```
Figure 4.2: Cluster size evolution over time for confirmation reducingSDS. Thex-axis
shows iterations. In the upper graph they-axis shows cluster size as a proportion of the
total number of agents, in the lower graph they-axis shows cluster size as a proportion of
the agents which have not yet been removed. The graphs show an accelerating growth in
the number of agents at the optimal hypothesis followed by a similar growth of terminating
agents at the optimal hypothesis until the entire swarm is terminating or removed.


The second plot (which shows the states of agents as a proportion of the agents not
yet removed) is much closer to the equivalent plot for independent reducingSDS. The
proportion of agents at the optimal hyptothesis, the proportion of terminating agents, and
the proportion of agents at noise solutions all evolve in similar ways.
From these two graphs it can be seen that both local halting criteria exhibit the behaviour
of a short period of apparent inactivity followed by the total swarm size reducing with
a characteristic S-curve. This shape is due to the positive-feedback effect of the reducing
behaviour as a larger number of terminating agents increases the chance of further agents
becoming terminating, as fewer agents remain this effect slows down. In the case of
confirmation reducingSDSthe number of terminating agents stabilises as there are no
more non-terminating. In the case of independent reducingSDSthe number of terminating
agents reaches zero as all agents are removed from the swarm.

#### 4.3.3 Discussion

The experiment performed on confirmation reducingSDSand independent reducingSDS
show that both variants exhibit the same features and the same problems. Both variants
are able to demonstrate the ability to diffuse the termination behaviour rapidly throughout
the swarm. Both variants are also highly greedy, with a high probability of converging to
the first hypothesis located in cases whereS>>A.
ReducingSDStherefore has demonstrated the ability for a halting behaviour to be instan-
tiated and spread by the actions of individuals, but has not demonstrated the ability to
indirectly compare a number of potential hypothesis outside of the case where only the
optimal hypothesis has a non-negligable score. The ability of standardSDSto indirectly
compare hypothesis is enabled by the stability of one cluster being requiring that there are
no other stable clusters present, in such a case the cluster with the lower score will collapse.
Therefore, in the next section a further variant is introduced in which the decision of an
agent to become terminating depends on a cluster’s stability.


### 4.4 Running-meanSDS

A further variant of reducingSDSadds an extra variable to the state of each agent, repre-
senting the agent’s confidence that the swarm has reached quorum at a given hypothesis.
This variable is introduced because ants were observed to require a number of repeated
visits to a candidate nest site before they would begin transporting, whereas an agent in
independent reducingSDSor confirmation reducingSDScould begin terminating the first
iteration after becoming active. The new variable is named the agent’s confidence. An
agent is determined to have sensed quorum and hence will commence terminating once
their confidence has reached a predetermined value called the quorum threshold. In the
new variant an agent’s confidence will be equal to the size of the cluster at the agent’s
hypothesis averaged over a number of iterations. The average cluster size is calculated at
each iteration, so the variant is called running-meanSDS.

The calculation of an agent’s confidence is controlled by two parameters, the minimum
interaction countmmin, and maximum memory lengthmmax. For every iteration an agent
remains active, they record the size of the cluster at their hypothesis. Until the number of
recorded cluster sizes equalsmminthe agents confidence is always zero. Once the number
of recorded cluster sizes equalsmminthe agent’s confidence is set to the mean average
of the recorded cluster sizes. Once the number of recorded cluster sizes equalsmmaxthe
oldest value is replaced with the newest one.

When an agent is inactive their confidence is reset to zero and their recorded values are
discarded. The purpose of requiring that at least a minimum number of values have been
recorded is to reflect that ants were observed to begin transporting only after a number
of visits to the same candidate nest site, and that the decision to begin transporting was
influenced by the size of the population at the candidate nest site [78]. It also has the effect
of reducing the amount of variance of the calculated mean which helps to ensure that an
agent will only sense quorum at a hypothesis which has formed a stable cluster.
Running-meanSDSmay be denoted as

```
SDS
```
###### (

###### ISYNCHRONOUS(DRUNNING MEAN(DHSTANDARD),TREDUCING(TSTANDARD)),HREDUCING

###### )


**Algorithm 39** DRUNNING MEAN— Running mean diffusion
1: **function** DRUNNING MEAN(DH,mmax,mmin, quorum threshold, swarm)
2: **function** D’(agent)
3: polled←random agent in swarm
4: **if** agent is inactive **then**
5: memory←empty queue of maximum lengthmmax
6: **if** polled is active **then**
7: hypothesis of agent←hypothesis of polled
8: **else**
9: hypothesis of agent←DH()
10: **else**
11: **if** agent is terminating **then**
12: **if** hypothesis of agent 6 =hypothesis of polled **then**
13: polled is removed from swarm
14: **else**
15: cluster size← number of active agents with hypothesis of agent
16: activity←cluster sizeswarm size
17: push activity into memory
18: **if** number of activities in memory≥mmin **then**
19: confidence←average activity value in memory
20: **if** confidence≥ quorum threshold **then**
21: agent becomes terminating
22: **return** D’

#### 4.4.1 Greediness of running-meanSDS

To examine whether running-meanSDSwas less greedy than reducingSDSa number of
instances were run in conditions of very high noise. The conditions were not varied, only
the level of the quorum threshold to investigate whether this would suppress convergence
to a distractor hypothesis. A distractor hypothesis is a single hypothesis with score _δ_ where
_β_ < _δ_ < _α_ The conditions used were _α_ =0.9, _δ_ =0.8, _β_ =0.1,A= 100 and employing
haltingHFIXED(200). The experiment performed an instance of running-meanSDSwith
valuesmmax=8,mmin=4 and every value for quorum threshold in the interval [0.0, 1.0]
with an step of 0.1. To simulate an search space of infinite size one agent was initialised at
each of the optimal hypothesis and the distractor hypothesis, andDHINFINITEwas used. For
each value of quorum threshold, the running-meanSDSwas run 10 000 times and the state
of the swarm after halting was recorded. The resulting state of the swarm could be any one
of {collapse, convergence to distractor, divided convergence, no convergence, convergence
to optimal}. The states were defined as follows.

```
Collapse No agents were active at the optimal hypothesis or distractor hypothesis.
Convergence to distractor All agents were active at the distractor hypothesis.
```

```
0 0.25 Quorum threshold0.50 0.75 1
```
```
0
```
```
2500
```
```
5000
```
```
7500
```
```
10000
```
```
Count
```
```
Halt statusCollapse
Convergence to distractorDivided convergence
No convergenceConvergence to optimal
```
Figure 4.3: Effect of varying quorum threshold on the halt status of running-meanSDS
when _α_ =0.9, _δ_ =0.8, _β_ =0.1

```
Divided convergence All agents were either active at the optimal hypothesis or active at
the distractor hypothesis.
No convergence None of the above halting criteria had occurred within two thousand
iterations.
Convergence to optimal All agents were active at the optimal hypothesis and each agent
had a confidence greater than the quorum threshold.
```
##### 4.4.1.1 Results

The results are plotted in Figure 4.3, p.149. The plot shows the effect of varying the quorum
threshold for set values of optimal hypothesis score and distractor hypothesis score. There
are five distinctly coloured regions, red for collapse, yellow for convergence to distractor,
green for divided convergence, blue for no convergence, purple for convergence to optimal.

The probability of collapse remains constant over all values of quorum threshold, this is
expected as collapse is only likely before a stable cluster has formed and until that point
there is no effect from the quorum sensing behaviour or running-meanSDS. When quorum


(^0102030405060) Iteration 70 80 90 100 110 120 130 140
0
10
20
30
40
50
60
70
80
90
100
Agent count
Agent statusInactive
NoiseDistractor
ActiveQuorate
Agent confidenceMax confidence
Mean confidence
Figure 4.4: State of individual agents, mean average confidence, and maximum confidence
values of the entire swarm over time in running-meanSDSwith _α_ =0.9, _δ_ =0.8, _β_ =0.1,
qt=0.9
threshold is zero there is a significant probability of either convergence to the distractor
hypothesis, divided convergence, or convergence to the optimal hypothesis, this is similar
to the greedy behaviour of reducingSDS, as any value of confidence over zero will induce
convergence. The probability of convergence to the distractor also remains fairly stable
until the quorum threshold reaches a point where it is greater than the expected steady
state cluster size for the distractor hypothesis, using equation 3.16 for standardSDSthis is
predicted to be0.74, whenqt=0.8there is still a small chance, but almost zero atqt=0.9.
Onceqt=1.0almost all results are no convergence, or collapse. Results of no convergence
represent two possible outcomes; firstly, that the algorithm would converge if a more
iterations were performed; secondly, that the algorithm would never converge. Successful
convergence to the optimal hypothesis, and not to the distractor hypothesis are observed
more frequently in cases where the quorum threshold has a value that is unlikely to be
attained by agents at the distractor hypothesis.
The state of the swarm, including the average and maximum values for the confidence of
all agents can be seen in Figure 4.4, p.150. Change in agent states over time demonstrates
that running-meanSDSbehaves in a similar way to standardSDSuntil at least one agent has
detected quorum. This can be understood by considering the proportion of the swarm that


is in each state over time. Initially, one agent maintains the optimal hypothesis, one agent
maintains the distractor hypothesis, and all other agents are inactive. In the next iteration,
the number of agents at noise hypotheses is larger than the number of agents at either the
distractor hypothesis or the optimal hypothesis. This is expected as the collection of all noise
hypothesis has a much higher probability of selection whilst the other clusters are small.
The probability of an active agent at a noise hypothesis is the product of the homogeneous
background noise, in this case _β_ = 0.1, and the number of inactive agents, which is
high in the early iterations. In the following iterations, both the distractor hypothesis
and the optimal hypothesis experience rapid growth due to the positive-feedback loop
of diffusion, in the plotted case the distractor hypothesis initially grows faster than the
optimal hypothesis. The slightly larger probability of agents remaining active at the optimal
hypothesis means that over time the population migrates from the cluster at the distractor
hypothesis into the cluster at the optimal hypothesis. The evolution of the swarm begins
to diverge from that of standardSDSonce a single agent begins terminating. This can be
seen when the plot of maximum agent confidence reaches0.9. Within a small number of
iterations, the number of quorate agents increases rapidly, and the total number of agents
in the swarm begins to reduce, firstly the number of inactive agents reaches zero, finally
the number of active agents reaches zero and the process halts.

#### 4.4.2 Discussion

```
Running-meanSDShas the advantage of an intuitive method of quorum sensing, a hypoth-
esis at which there is a consistently high average number of agents at a single hypothesis
is an intuitive method of detecting a stable cluster. The disadvantage of this method is
that it requires extra memory for every agent, and extra computation to calculate the mean
averages.
```
The effect of the quorum threshold is beneficial in cases where both the optimal hypothesis
score and distractor hypothesis score are strong, but _α_ <1. The plot showing when _α_ =0.9
and _δ_ =0.8shows a large increase in the probability of a successful convergence to the
optimal with increasing quorum threshold. In cases where there is no distractor hypothesis,
or no homogeneous background noise the quorum threshold will have no positive effect
on the proportion of successful convergences, as in such cases being greedy is the optimal
behaviour.


### 4.5 Quorum sensingSDS

Where running-meanSDSrequires calculating an exact value for the cluster size, it is not
necessarily required that an exact value is calculated when the important information
is simply whether the cluster is of sufficient size. A simpler method is investigated for
its ability to detect the result of comparing cluster size against a threshold without ever
actually calculating the cluster size.
In quorum sensingSDS, an active agent’s confidence is incremented by one for every
diffusion phase in which they poll an active agent which shares their hypothesis. Quorum
sensingSDSdoes not rely on the memory length and minimum interactions variables of
running-meanSDSbut employs one new variable, decay. At the end of each diffusion
phase the confidence of all agents is reduced by being multiplied by the decay which is
a constant value in the interval(0, 1). While an agent is inactive their confidence is set to
zero.
Cases with a higher value for decay (and hence the confidence of each agent decreases by a
smaller proportion each iteration) have a higher maximum achievable value for confidence.
This is because each iteration confidence can at most increase by 1 before decaying, and the
amount the confidence decreases each iteration is proportional to its current value. There-
fore there is a point at which the maximum increase per iteration equals the guaranteed
decrease per iteration. Consider an active agent at a perfect hypothesis, in a cluster that
consisted of the entire swarm, that agent is guaranteed to increase their confidence by one
every iteration, their confidence would stop increasing when the confidence decreased ev-
ery iteration by the same amount. That is, whencmax−(cmax∗d) =1, wheredis the decay,
andcmaxis the maximum value confidence would reach. Rearranging givescmax= 1 −^1 d.
Therefore taking a small value of decay,d=0.5yieldscmax=2, and taking a large value
d=0.99yieldscmax= 100 , in the cases presented hered=0.9and socmax=10. Quorum
sensing diffusion (DQUORUM SENSING) is shown in algorithm 40.
Quorum sensingSDSmay be denoted as

```
SDS
```
###### (

###### ISYNCHRONOUS(DQUORUM SENSING(DHSTANDARD),TREDUCING(TSTANDARD)),HREDUCING

###### )


```
Algorithm 40 DQUORUM SENSING— Quorum sensing diffusion
1: function DQUORUM SENSING(DH, decay, quorum threshold, swarm)
2: max confidence← 1 −decay^1
3: confidence threshold←max confidence×quorum threshold
4: function D’(agent)
5: polled←random agent in swarm
6: if agent is inactive then
7: confidence of agent← 0
8: if polled is active then
9: hypothesis of agent←hypothesis of polled
10: else
11: hypothesis of agent←DH()
12: else
13: if agent is terminating then
14: if hypothesis of agent 6 =hypothesis of polled then
15: polled is removed from swarm
16: else
17: if polled is activeandhypothesis of agent=hypothesis of polled then
18: confidence of agent←confidence of agent+ 1
19: confidence of agent←confidence of agent×decay
20: if confidence of agent≥ confidence threshold then
21: agent becomes terminating
22: return D’
```
#### 4.5.1 Experiment on the robustness of quorum sensingSDS.

To observe the effect of varying the quorum threshold, an instance of quorum sensingSDS
was initialised, with one agent active at the optimal hypothesis, one agent active at the
distractor hypothesis, and all other agents inactive. The algorithm was then iterated until
halting, for a maximum of 1,000 iterations. This experiment was repeated 100 for each valid
combination of the four variables (i) quorum threshold (qt), (ii) optimal hypothesis score,
(iii) distractor hypothesis score ( _δ_ ), and (iv) uniform background noise, where hypothesis
scores and quorum threshold took the values in the range [0,1] in steps of 0.1. A valid
combination is one where 0 ≤ _β_ < _δ_ < _α_ ≤1. Two parameters were not varied; the swarm
was always initialised with exactly one hundred agents, and the decay was always0.9,
meaning that at the end of every iteration, the confidencecof each active agent would
be reduced to0.9c. After each instance had halted, the resulting state of the swarm was
recorded, using the same categorisation as in the experiment with running-meanSDS,
{collapse, convergence to distractor, divided convergence, no convergence, convergence to
optimal}.


##### 4.5.1.1 Results

Figure 4.5, p.155 shows the results for all experiments where uniform background noise was
0.1. Each plot shows the effect of varying the quorum threshold for set values of optimal
hypothesis score and distractor hypothesis score. There are six distinctly coloured regions,
red for collapse, yellow for convergence to distractor, green for divided convergence, blue
for no convergence, purple for convergence to optimal, and grey for areas that represent
when _δ_ < _α_ does not hold.

**Collapse** For values where _α_ ≤0.5the most common result was collapse. Other results
are observed once _α_ or _δ_ become large enough to form stable clusters, and collapse becomes
increasingly rare as the hypothesis scores become stronger. The probability of collapse is
zero in cases where the optimal hypothesis score equals one. As with independent reducing
SDSand confirmation reducingSDSthere is a small possibility of convergence in cases
where _α_ < _α_ minand when quorum threshold is low. Whenqt=0 quorum sensingSDS
behaves exactly as confirmation reducingSDSand is therefore very greedy.

```
Convergence to distractor For a swarm to converge entirely to the distractor, with no
agents at the optimal hypothesis, the cluster at the optimal hypothesis must have collapsed
entirely, and an agent at the distractor hypothesis must have become terminating. This
result is therefore seen most clearly in the cases where the optimal hypothesis score is weak
enough to have a significant probability of collapse but the distractor hypothesis is strong
enough to maintain a stable cluster.
```
**Divided convergence** Divided convergence requires that agents become terminating at
both the optimal hypothesis and distractor hypothesis. Two distinct patterns can be seen in
the instances of divided convergence. Firstly when _α_ =1, the quorum threshold appears
to have little effect, with the ratio of convergence to optimal results to divided convergence
results being determined only by the distractor hypothesis score. Secondly, in cases where
_α_ <1, the proportion of divided convergence results can be seen to be influenced by the
quorum threshold; as the value of quorum threshold increases the proportion of divided
convergence results decreases to zero.


(^1) 0.5 0
Distractor Hypothesis Score
0.3
Halt status
CollapseConvergence to distractorDivided convergenceNo convergenceConvergence to optimal
0.4
0.5
0.6
0.7
0.8
0.9
1.0
0.2
(^1) 0.5 0
0.3
(^1) 0.5 0
0.4
(^1) 0.5 0
0.5
(^1) 0.5 0
0.6
(^1) 0.5 0
0.7
(^1) 0.5 0
0.8
0
0.5
1
(^1) 0.5 0
0
0.5
10
0.5
10
0.5
10
0.5
10
0.5
10
0.5
10
0.5
1
Optimal Hypothesis Score
0.9
Quorum Sensing SDS with noise = 0.1
Figure 4.5: Effect of varying quorum threshold on the halt status of quorum sensingSDS
when _β_ =0.1. For each plot thex-axis measures quorum threshold and they-axis measures
the proportion of each result.


```
0 0.1 0.2 0.3 0.4Quorum threshold0.5 0.6 0.7 0.8 0.9 1
```
```
0
```
```
0.25
```
```
0.50
```
```
0.75
```
```
1
```
```
Proportion
```
```
Halt statusCollapse
Convergence to distractorDivided convergence
No convergenceConvergence to optimal
```
```
Effect of varying quorum threshold
```
Figure 4.6: Effect of varying quorum threshold on the halt status of quorum sensingSDS
when _α_ =0.9, _δ_ =0.8, _β_ =0.1

**No convergence** Results of no convergence represent two possible outcomes; firstly, that
the algorithm would converge if a certain number of iterations were performed beyond the
two thousand used in the experiment; secondly, that the algorithm would never converge.
This result only appears in cases where the quorum threshold is greater than zero, the
absolute value being larger as the optimal hypothesis score increases.

```
Convergence to optimal Successful convergence to the optimal hypothesis, and not to the
distractor hypothesis are observed in cases where the optimal hypothesis is strong enough
to maintain a stable cluster, and the quorum threshold has a value that can be attained
by agents at the optimal hypothesis and cannot be attained by agents at the distractor
hypothesis. The effect of the quorum threshold is most beneficial in cases where both the
optimal hypothesis score and distractor hypothesis score are strong, but α <1. Therefore
the plot showing when optimal hypothesis score is 0.9 and the distractor hypothesis score
is 0.8 shows the greatest increase in convergence to optimal results with increasing quorum
threshold. As with running-meanSDS, in cases where there is no distractor hypothesis, or
no homogeneous background noise the quorum threshold will have no positive effect on
the proportion of successful convergences, as in such cases being greedy is the optimal
behaviour.
```

#### 4.5.2 Experiment on the effect of decay

Introducing the notion of an agent’s confidence value, which decays over time, raises the
question of the rate at which the value decays. In quorum sensingSDS, the value of decay
is a real number in the range[0, 1]. As this is a free variable it is essential to investigate how
the behaviour of quorum sensingSDSwill change as different values are chosen. To this
end the following experiment is proposed.

As with other experiments, a search space was be defined with only three hypotheses,
one representing the optimal hypothesis, one representing the distractor hypothesis, and
the other representing homogeneous background noise. An infinite search space size was
simulated withDHINFINITE, so one agent was initialised as active at the optimal hypothesis,
and at the distractor hypothesis. The confidence values of all agents at any noise hypothesis
was reset to zero at the beginning of each test phase. The search space used always had the
scores _α_ =0.9, _δ_ =0.8, _β_ =0.1.

This experiment recorded the number of iterations before a successful convergence, and
the probability of a successful convergence, across a range of values for quorum threshold
when the value for decay is low (0.5), medium (0.8, and 0.9), and high (0.99).

##### 4.5.2.1 Results

```
For each value of decay, the average number of iterations before convergence can be seen
in Table 4.5, p.160, these values are also plotted in Figure 4.8, p.159.
For any value of decay, the number of iterations before a successful convergence increase
as the value for quorum threshold increases, this is expected as a higher quorum threshold
requires agents to reach a higher confidence value. There are cases where no successful
convergences are detected, even thoughqt<1 this represents cases where no agents
reach the theoretical maximum because they do not remain active long enough to reach it.
Given infinite time an agent would eventually remain active long enough and increase its
confidence sufficiently to become terminating but this becomes increasingly unlikely asct
increases. Therefore the practical value of quorum threshold must be lower than 1 for all
cases where agents are not expected to remain permanently active, i.e. when α <1.
For each value of decay, the probability of a successful convergence for a range ofqtcan be
```

```
0 0.5 1 1.5 2
```
```
0
```
```
0.25
```
```
0.50
```
```
0.75
```
```
P
```
```
0.5
```
```
0 1 2 3 4 5
```
```
0.8
```
```
0 2.5 5 7.5 10
```
```
0
```
```
0.25
```
```
0.50
```
```
0.75
```
```
0.9
```
```
Quorum Threshold^0204060
```
```
0.99
```
Figure 4.7: Effect of varying quorum threshold on the probability of successful convergence
when decay = 0.5, 0.8, 0.9, 0.99.


```
0 0.25 0.50 0.75
```
```
15
```
```
20
```
```
25
```
```
30
```
```
Iterations
```
```
0.5
```
```
0 1 2 3
```
```
50
```
```
100
```
```
150 0.8
```
(^002468)
250
500
750
0.9
Quorum Threshold^0204060
0
10000
20000
30000
0.99
Figure 4.8: Effect of varying quorum threshold on the number of iterations before successful
convergence when decay = 0.5, 0.8, 0.9, 0.99.


```
Decay QT ct s n P μ σ CV
0.50 0.20 0.40 3 667 10 100 0.363 13.002 1.782 0.137
0.50 0.25 0.50 4 815 10 100 0.477 17.106 2.235 0.131
0.50 0.30 0.60 4 921 10 100 0.487 17.303 2.307 0.133
0.50 0.35 0.70 5 310 10 100 0.526 17.931 2.465 0.137
0.50 0.40 0.80 6 544 10 100 0.648 22.780 3.305 0.145
0.50 0.45 0.90 7 658 10 100 0.758 29.471 4.735 0.161
0.50 0.50 1.00 0 10 100 0.000 — — —
```
```
0.80 0.50 2.50 8 128 10 100 0.805 35.469 5.818 0.164
0.80 0.55 2.75 8 523 10 100 0.844 43.292 7.405 0.171
0.80 0.60 3.00 8 862 10 100 0.877 52.896 9.524 0.180
0.80 0.65 3.25 9 081 10 100 0.899 64.904 11.895 0.183
0.80 0.70 3.50 9 188 10 100 0.910 91.400 17.056 0.187
0.80 0.75 3.75 8 910 10 100 0.882 144.086 22.699 0.158
0.80 0.80 4.00 0 10 100 0.000 — — —
```
```
0.90 0.60 6.00 9 234 10 100 0.914 101.918 19.425 0.191
0.90 0.65 6.50 9 234 10 100 0.914 135.928 26.123 0.192
0.90 0.70 7.00 9 235 10 100 0.914 181.802 35.838 0.197
0.90 0.75 7.50 9 290 10 100 0.920 270.267 54.128 0.200
0.90 0.80 8.00 9 267 10 100 0.918 406.803 81.237 0.200
0.90 0.85 8.50 9 253 10 100 0.916 868.723 168.400 0.194
0.90 0.90 9.00 0 10 100 0.000 — — —
```
```
0.99 0.45 45.00 9 307 10 100 0.921 2 296.990 365.583 0.159
0.99 0.50 50.00 97 10 100 0.010 3 558.577 849.051 0.239
0.99 0.55 55.00 93 10 100 0.009 6 865.022 2 584.689 0.377
0.99 0.60 60.00 87 10 100 0.009 15 944.920 9 284.443 0.582
0.99 0.65 65.00 37 10 100 0.004 23 854.649 11 317.487 0.474
0.99 0.70 70.00 4 10 100 0.000 36 732.750 6 124.616 0.167
0.99 0.75 75.00 0 10 100 0.000 — — —
```
Table 4.5: The number of iterations of quorum sensingSDSbefore a successful halt for
various values of decay. Columns are, confidence threshold at which an agent becomes
terminating (ct), number of successful convergences (s), number of repeats (n), probability
of successful convergence (P), mean average number of iterations ( _μ_ ), standard deviation
of number of iterations ( _σ_ ), coefficient of variation of iterations (CV)


```
seen in Table 4.5, p.160, these values are also plotted in Figure 4.7, p.158.
```
#### 4.5.3 Discussion

We have examined the behaviour of quorum sensingSDSover a range of values for param-
eters which describe all search spaces which will be encountered in practical applications,
either as computational search problems or by ants or bees in nature.

The mechanism which defines the activity and hypotheses of agents in quorum sensingSDS
is identical to that of standardSDSuntil a single agent has detected quorum, that is their
confidence value has reached a predetermined quorum threshold, as so the behaviour of
quorum sensingSDSup until that point can be adequately modelled by the existent models
ofSDS.

The memory requirements for quorum sensingSDSare higher than standardSDSas each
agent needs to record their confidence value, though one value per agent is unlikely to be
a limiting factor for memory in an algorithm. Similarly the computational complexity of
quorum sensingSDSis greater than standardSDSas each agent may need to increment,
decay, and compare their confidence values once per iteration. Both of the increased
memory requirements and increased computational complexity are small and will increase
linearly with the number of agents.

##### 4.5.3.1 Effect of quorum threshold

Whenqt=0, both running-meanSDSand quorum sensingSDSbehave like confirmation
reducingSDS. As can be seen figure 4.5 there is always at least a small chance of convergence
whenqt=0, even in cases where stable clusters would not form. This is because an active
agent requires only a single confirmatory contact to commence terminating. Even a single
agent at a hypothesis with scoreswill become active and subsequently poll itself in the
diffusion phase with a probabilityAs, after which it will remain terminating. This is also
possible whenqt>0 but with a diminishing probability at quorum threshold increases.
Conversely, an instance of quorum sensingSDSor running-meanSDSwhereqt=1 will
behave identically to an instance of standardSDSwhereH=HINDEFINITE.

As an active agent’s confidence value depends on the number of other agents with the


```
same hypothesis, an agent’s confidence value will have the greatest probability of reaching
its maximum value once the cluster at the hypothesis has reached its largest size, and hence
stabilised. This behaviour therefore is likely to converge on a hypothesis which has not
only got the largest cluster, but has also stabilised at a sufficiently large size. Once this has
occurred the effect of quorum threshold is act as the threshold determining whether the
cluster is of sufficient size to represent an acceptable solution.
```
##### 4.5.3.2 Effect of decay

The immediate effect of decay is to reduce larger confidence values by more than smaller
confidence values. The impact on quorum sensingSDSis that with higher values of decay
(and hence smaller reductions in confidence each iteration) there is a larger maximum
value which an agent’s confidence may reach. As an agent’s confidence can only increase
by a maximum of 1 each iteration, before decaying, larger values take more iterations to
be reached. A larger decay therefore enables the selection of values for quorum threshold
which can only be reached after many repeated tests. Many repeated tests will reduce the
effect of stochastic noise, in accord with the law of large numbers. This reduces the chance
of rare results due to the stochastic nature ofSDSbut increases the time taken for quorum
sensing. This stabilising time also helps ensure the hypothesis is of genuinely high quality,
reducing the probability of a stochastic aberrations, and also allowing some time for other
agents to evaluate more of the search space and potentially locate a superior hypotheses.
One case not explored was the possibility of having no decay at all, equivalent to setting
decay=1, in this case an agents confidence value would increase monotonically so long
as they remained active. This would remove the theoretical upper bound for confidence
values, but practically the maximum confidence value will be capped by the probability
of an agent eventually becoming inactive, a probability that increases over time for an
active agent in all cases except when an agent has located a perfect hypothesis. This variant
would have the advantage that it would always halt regardless of the value chosen for the
quorum threshold in cases that a perfect hypothesis is present in the search space, whereas
any variant which uses decay implies a maximum theoretical value on an agents confidence
value; in cases of no decay even imperfect hypotheses have a probability, however small, of
an agent’s confidence reaching any value. A disadvantage of this variant is that it requires
the storage of arbitrarily large integers, at least as large as the quorum threshold, to record


the confidence values of agents, this is slightly less biologically plausible than the variant
which uses decay, as discrete digital counters are seen less in nature than continuous values
which decrease quicker as they increase in size.

##### 4.5.3.3 Comparison of running-meanSDSwith quorum sensingSDS

The ability of a swarm of ants to be able to effectively calculate a mean average evaluation
for a location has been previously observed [28] and the evidence that quorum sensingSDS
behaves in a similar way to running-meanSDSindicates that a similar mechanism may be
in use in nature. If quorum sensingSDSis therefore interpreted as effectively identifying
the mean cluster size at a hypothesis, it follows that the effect of quorum threshold is to
enforce a threshold for the mean cluster size of the hypothesis below which the algorithm
will not converge.

Similarly they can both be modulated for the minimum acceptable hypothesis quality
with the quorum threshold, and they can both be modulated for the minimum amount
of validation required, using decay in the case of quorum sensingSDSand minimum
interactions in the case of running-meanSDS. This indicates that simple biological agents,
and simple computational agents are able to effectively decide whether the population at
a given candidate nest site is over a certain proportion of the entire colony with a simple
mechanism.
Both running-meanSDSand quorum sensingSDSrequire agents to remain active at a
hypothesis for a number of iterations, the precise number of iterations has a lower bound
set by a parameter. In running-meanSDSthe parameter is minimum interactions, in quorum
sensingSDSthe parameter is a combination of decay and quorum threshold. Once an agent
is active in both quorum sensingSDSand running-meanSDSthe agent will terminate if the
value ofcluster sizeswarm sizeis sufficiently large, in the case of running-meanSDSthis is the calculation
of the average swarm size, in the case of quorum sensingSDSthis is the probability that a
randomly polled agent will maintain the same hypothesis.

The distinction between running-meanSDSand quorum sensingSDSis that where running-
meanSDScalculates an exact value and tests it against a threshold, quorum sensingSDS
manages to test an equivalent value against the same threshold but without explicitly
calculating it. This observation is reminiscent of an observation made in section 3.5.6 on


```
the ability of bacteria to detect an occurrence, due to their context they need not be able to
detect the exact situation they are in, simply that they are in a situation in which to perform
a suitable behaviour. In this case the action of quorum sensingSDSis not to calculate a
cluster size, merely to detect whether the cluster is of sufficient size.
```
The similar behaviours can be seen as in the experiment for the same parameters with
quorum sensingSDS(Figure 4.6, p.156). The similarity in halting behaviour of running-
meanSDSand quorum sensingSDSshows that the simple mechanism employed by quorum
sensingSDSprovides the swarm with similar powers of discrimination as the more complex
mechanism employed by running-meanSDS.

The quorum threshold of ants during nest site evaluation was determined to be constant
proportional to colony size and modulated depending on the conditions (Section 3.5.4.1).
In running-meanSDSand quorum sensingSDSthe quorum threshold is constant for each
instance, but can be selected depending on conditions of the task. Quorum threshold can
be chosen to bias towards a lower bound on the quality of hypothesis which may induce
terminating behaviour, and decay can be chosen to affect the amount of confirmation an
ant will require before becoming terminating. A high quorum threshold forces the rejection
of lower quality hypothesis but at the risk of never halting, whereas a high decay forces an
increase in the amount of validation a hypothesis received, but at the expense of a longer
execution time.

### 4.6 Differences between quorum sensingSDSand ant nest-site selection

Although the design of quorum sensingSDSwas inspired by the nest-site selection of ants,
there are certain important differences. Importantly, there is no discrete halt state for a
swarm of ants, once a new nest site has been located and the migration completed, the
swarm continues performing the multitude of other tasks required for a colony of ants to
survive. This has two implications for the suitability of quorum sensingSDSas a model for
ant behaviour, firstly the behaviour of ants removed from the swarm is ignored, secondly,
the probability of future migrations is ignored. An agent removed from the swarm in
quorum sensingSDSperforms no further actions, whereas an ant transported to a new nest
will immediately perform other actions.


Reverse tandem running is not directly analogous to any activity in quorum sensingSDS.
One possible reason for this as that agents which have begun terminating are still treated
as active agents. If terminating agents were considered inactive inDQUORUM SENSINGthen
their hypotheses would not be assumed by inactive agents. In such a case a number of
terminating agents may begin removing other agents from the swarm without increasing
the cluster size at their hypothesis. In this case a mechanism analogous to reverse tandem
running may be useful to return some of the terminating agents to their active, recruiting,
state. A potential implementation of mechanism is to have all agents who have detected
quorum randomly polling another agent, and becoming active, but not terminating, if the
polled agent is also terminating and maintaining the same hypothesis. This mechanism
may be useful in two situations: firstly, if a number of agents begin terminating at a poor
quality hypothesis, this would provide a means by which such agents could become merely
active and later, inactive; secondly, if all of the agents in a small cluster begin terminating
at a high quality hypothesis, this would provide a means by which they could become
active and then attract more agents to the cluster. Both of these behaviours would decrease
the number of situations in which this variant of quorum sensingSDSwould converge to
a suboptimal solution, either by speeding up the speed of convergence to a high quality
hypothesis, or halting the process of convergence to a low quality hypothesis. This may
be analogous to behaviour in ants as at any one time each ant may only be performing
at most one of the two behaviours of recruitment via tandem running, or migration by
transporting.

This process may even show how the accuracy of the process does not require full coop-
eration from all individuals, and is even robust in the face of belligerent agents. As the
formation of stable clusters in quorum sensingSDSis identical to that of standardSDS
before ant agents begin terminating, the mathematical models of over variants can be
employed. The effect of the secret optimist (Section 3.4.2.4) for example will increase the
effective score of all hypotheses. This suggests that the effect of an ant performing the same
activity, ignoring the results of its evaluation, even a multitude of these ants do not lead to a
collapse of the system, simply an increased chance of converging to a low quality solutions,
in cases where no solutions of sufficient quality exist this may even be a benefit, forcing
the swarm to choose “any port in a storm”. Similarly, the hermit (Section 3.4.2.3) causes
agents to refuse to share their hypothesis, and hence the effective score of all hypotheses
decreases. An agent that does not share its hypothesis is analogous to an ant which is


```
not participating in the recruitment. This has the effect of increasing the chance of failure
to converge to a solution. As with the secret optimist this may be a benefit, in relatively
benign cases where a bad decision is worse than no decision.
```
### 4.7 Conclusion

Four methods for implementing local termination inSDShave been examined. indepen-
dent reducingSDSclosely modelled the behaviour of ants, confirmation reducingSDS
remained close to the definition of standardSDS. Both demonstrated the ability to diffuse a
termination behaviour through a swarm without using an external halting method, they
were also very greedy due to not requiring any validation of the quorum sensing mecha-
nism. running-meanSDSand quorum sensingSDSused alternative methods to validate
the quorum sensing mechanism, before diffusing the terminating behaviour through the
swarm. running-meanSDSused an exact method, and quorum sensingSDSused a stochas-
tic process to model the observation that ants performing nest site selection determined
their behaviour as a result of the population level at a candidate nest site. The requirement
for validation of the quorum sensing mechanism means that both running-meanSDSand
quorum sensingSDSare not so greedy as independent reducingSDSand confirmation
reducingSDS. In both cases an agent begins terminating once their confidence has reached
a given quorum threshold. The discrimination abilities of running-meanSDSand quorum
sensingSDShave been shown to be very similar.
Furthermore the requirement that clusters are stable for a number of iterations ensures
an important feature of standardSDSis expressed. As seen in section 3.2.4 agents will
have orders of magnitude greater probability of being in one cluster than another, even
with a fairly small difference between the score of the hypotheses, this means that should
ants implement such a system then they will effectively compare nest sites indirectly, by
maintaining only one stable population at the superior nest site.
Quorum sensingSDStherefore demonstrates the ability of ants to to select only candidate
nest sites of sufficient quality, but also to select the best nest site out of all candidates
encountered, and furthermore to balance between a quick decision in harsh conditions and
an accurate decision in benign conditions. All without executive control over the entire
swarm, and without direct comparison of two sites.



