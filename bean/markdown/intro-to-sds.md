> ```
> INITIALISE (mappings);
> REPEAT
>     TEST (mappings);
>     DIFFUSE (mappings);
> UNTIL TERMINATION;
> ```
> 
> SDS as Introduced by Bishop (1989)

# Introduction to Stochastic Diffusion Search (SDS)

First described in 1989 by J.M. Bishop, Stochastic Diffusion Search (SDS) was introduced
as an evolution of the study of Hinton mapping [7] (Section 2.2.3.6, p.50). Where Hinton
mapping identifies objects by testing for all possible combinations of stimuli, SDS stochastically tests certain hypotheses against partial combinations of stimuli, and subsequently
performs a diffusion process where more promising hypotheses are more likely to be tested
against further features. At the time, and at least as late as 1998 [67], the term “Stochastic
Search Networks” was used, but SDS will be used throughout.

SDS has a number of important features, including; robustness in the presence of noise; a
simplicity that lends itself well to mathematical modelling; and stable global state emerging
from the stochastic behaviour of individuals. Its robustness make SDS particularly suited
to real world tasks which may be noisy, and may change over time. The relative ease of
modelling SDS mathematically has lead to the ability to predict a number of aspects of its
behaviour. The stability of SDS means it may also be an important model for methods of
guiding intelligent behaviour without a central executive control.

The operation of SDS is most intuitively explained by analogy, a number of which have been
used, most commonlyThe Restaurant Game[15], and more recentlyThe Mining Game[86].
These are described below, followed by the pseudocode of a single iteration ofSDS.

#### 3.1.1 The Restaurant Game

The Restaurant Game, reproduced here from 2003 [15], describes how a group of people may
employ SDS to perform a search for the best restaurant in an unfamiliar town.

> A group of delegates attends a long conference in an unfamiliar town. Each
> night they have to find somewhere to dine. There is a large choice of restaurants,
> each of which offers a large variety of meals. The problem the group faces is to
> find the best restaurant, that is the restaurant where the maximum number of
> delegates would enjoy dining. Even a parallel exhaustive search through the
> restaurant and meal combinations would take too long to accomplish. To solve
> the problem delegates decide to employ a Stochastic Diffusion Search.
> Each delegate acts as an agent maintaining a hypothesis identifying the best
> restaurant in town. Each night each delegate tests his hypothesis by dining
> there and randomly selecting one of the meals on offer. The next morning
> at breakfast every delegate who did not enjoy his meal the previous night,
> asks one randomly selected colleague to share his dinner impressions. If the
> experience was good, he also adopts this restaurant as his choice. Otherwise he
> simply selects another restaurant at random from those listed in ‘Yellow Pages’.
> Using this strategy it is found that very rapidly [a] significant number of dele-
> gates congregate around the best restaurant in town.

The process of the restaurant game has a number of notable features. Within minimal
centralised control the group of delegates acts together to solve a problem that could not
be quickly solved by an individual. The delegates will efficiently move to the next best

restaurant if the current one has a significant drop in standards or closes down entirely.
The restaurants, the menus, or the individual meals need to be directly comparable, all
that is required is for each agent to decide for themself whether their experience was
good. Delegates will find themselves enjoying many evenings in a relatively high quality
restaurant long before all of the meals in all of the restaurants in town could have been
evaluated.

This analogy has been criticised on the grounds that delegates are likely to have differing
dining preferences and hence it is possible for a delegate to locate a restaurant in which
they enjoy all of the meals on offer, but which is unsatisfying to all other delegates. In the
case where only one delegate, or a small proportion of the group, remains permanently at
such a restaurant the rest of the group will proceed largely as usual and so the majority will
still converge on the best restaurant. Taken to the extreme, however, all agents may find
themselves dining alone, even when there exists a single superior restaurant which would
satisfy the largest portion of the delegates. This superior restaurant would never be located
as all delegates are satisfied with the meals at their current restaurant, and hence never
select a new restaurant. This critique led to the development ofThe Mining Game, which
depends on the less subjective notion of locating gold rather than dining preferences.

#### 3.1.2 The Mining Game

Originally defined in 2010 [85] the Mining Game uses an analogy of searching a landscape
for the best mining prospect. A slightly improved version from 2013 [84] is quoted below.

> A group of friends (miners) learn that there is gold to be found on the hills of a
> mountain range but have no information regarding its distribution. On their
> maps the mountain range is divided into a set of discrete hills and each hill
> contains a discrete set of seams to mine. Over time, on any day the probability
> of finding gold at a seam is proportional to its net wealth.
> To maximise their collective wealth, the miners need to identify the hill with
> the richest seams of gold so that the maximum number of miners can dig there
> (this information is not available a-priori). In order to solve this problem, the
> miners decide to employ a simple Stochastic Diffusion Search.
> - At the start of the mining process each miner is randomly allocated a hill to mine (his hill hypothesis,h).
> - Every day each miner is allocated a randomly selected seam on his hill to mine.
> - At the end of each day, the probability that a miner is happy^1 is proportional to the amount of gold he has found.
> - At the end of the day the miners congregate and over the evening each
>     miner who is unhappy selects another miner at random to talk to. If the
>     chosen miner is happy, he happily tells his colleague the identity of the hill
>     he is mining (that is, he communicates his hill hypothesis,h, which thus
>     both now maintain). Conversely, if the chosen miner is unhappy he says
>     nothing and the original miner is once more reduced to selecting a new
>     hypothesis — identifying the hill he is to mine the next day — at random.
> 
> In the context of SDS, agents take the role of miners; active agents being ‘happy
> miners’, inactive agents being ‘unhappy miners’ and the agent’s hypothesis
> being the miner’s ‘hill-hypothesis’. It can be shown that this process is
> isomorphic toSDS, and thus that the miners will naturally self-organise and
> rapidly congregate over hill(s) on the mountain range with a high
> concentration of gold.

The happiness of the miners can be measured probabilistically, or represented with an
absolute boolean value, so long as each miner is either happy or unhappy by the end of
each day [82]. Furthermore, if the gold is modelled as a finite resource, reducing over time,
then the search is sufficiently adaptive that miners change where they congregate as the
location with the most gold changes.
