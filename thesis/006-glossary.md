## 6 Glossary

# Glossary

**activity** the state of an agent which indicates the strength of the its current hypothesis.

**agent** an element of a swarm which maintains a hypothesis and an activity.

**cluster** a number of agents maintaining the same hypothesis.

**confidence** a value internal to an agent in quorum sensingSDSwhich represents the
amount of evidence an agent has of a swarm reaching quorum..

**confirmation reducingSDS** a variant ofSDSin which agents may remove other agents
from the swarm after having had their hypothesis ‘confirmed’ by polling other agents
with the same hypothesis.

**context-freeSDS** a variant implementingDCONTEXT-FREE.

**context-sensitiveSDS** a variant implementingDCONTEXT-SENSITIVE.

**convergence time** the number of iterations before a stable cluster forms.

**diffusion phase** the phase ofSDSin which new hypotheses are generated, and potentially
good hypotheses are distributed amongst the swarm.

**distractor hypothesis** the hypothesis with the second highest score in the search space.

**distractor hypothesis score** the score of the distractor hypothesis.

**global activity** the proportion of the swarm which are active at a given time.


**homogeneous background noise** the mean probability of an agent at any non-optimal
hypothesis becoming active.

**hypothesis** a potential solution to a search problem.

**independent reducingSDS** a variant ofSDSin which agents act independently.

**iteration** the performance of a diffusion phase and a test phase for all agents in a swarm.

**mean cluster size** the mean number of active agents maintaining the optimal hypothesis
as a proportion of the total population.

**microtest** a function which partially evaluates a hypothesis. It takes a hypothesis as an
argument and returnstrueif the hypotheses passes the partial evaluation.

**minimum convergence criteria** the minimum score of the optimal hypothesis below which
a stable cluster cannot form.

**multi-diffusion** a variant of the diffusion phase where multiple diffusion behaviours are
performed each iteration.

**multi-testing** a variant of the test phase where each agent performs more than one mi-
crotest.

**one-step evolution function** mean 1-step optimal cluster size evolution function.

**optimal hypothesis** the hypothesis with the maximum score in the search space.

**optimal hypothesis score** the score of the optimal hypothesis.

**quorum sensingSDS** a reducingSDSin which agents confidence value is determined by
contacts with agents maintainint the same hypothesis.

**quorum threshold** a value against which an agent’s internal confidence value is compared
when deciding whether to begin terminating in quorum sensingSDS.

**reducingSDS** a variant ofSDSin which agents may remove other agents from the swarm.

**robustness** the proportion of possible search spaces to whichSDScan be successfully
applied.

**running-meanSDS** a reducingSDSin which agents commence reducing once the average
activity over time at their hypothesis reaches a given threshold.


**score** the probability of a specific hypothesis passing a randomly selected microtests.

**search space** the set of all possible hypotheses, representing the set of all potential solutions
to a task.

**search space size** the number of possible hypotheses.

**steady state** the average number of agents at the optimal hypothesis upon convergence.

**string-searchSDS** an application ofSDSto locate the closest instansiation of a model
substring of a larger search space string. For example, finding the location of the
word ‘circumambulate’ in the text of Moby Dick, or the encoding of a protein in a
string of DNA base pairs. A hypothesis denotes the location of the model in the search
space, and there is one microtest for each character in the model. Each microtest
passes if the letter at a particular offset in the model is the same letter in the search
space at the same offset to the hypothesised location.

**strong convergence criterion** the requirements for a cluster to be stable over any amount
of iterations..

**swarm** a collection of agents.

**swarm size** the number of agents in a swarm.

**test phase** the phase ofSDSin which agents update their hypotheses as a result of partial
evaluations.

**time to first hit** the number of iterations at which the probability that an agent is maintain-
ing the optimal hypothesis reaches a given probabilityp.



