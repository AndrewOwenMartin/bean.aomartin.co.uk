**Chapter 5**

## 5 Conclusion and Future Work

This thesis introduced AI as a field with historical roots and a modern mature state in which
progress can largely by identified as sharing an underlying approach of either making a
mind or modelling the brain. Swarm intelligence was presented as an alternative approach
which is related to both previous approaches, but perfectly described by neither. Certain
behaviours of some natural swarms were presented which were used as the basis for further
investigation.SDSwas described in detail as an example of a swarm intelligence algorithm
which had both practical application and behaviour analogous to that observed in natural
swarms. All major variants ofSDSwere categorised and individually examined for their
population level behaviour and the resulting advantages and disadvantages. A new variant
ofSDS, reducingSDS, was defined which aimed to demonstrate whether a individual level
activity inspired by an activity observed in natural swarm would effect quorum sensing, a
population level activity observed in ants. The variant demonstrated that quorum sensing
was achievable with individual action, but the practicality of the variant was limited due
to greedy convergence. A further variant ofSDS, quorum sensingSDS, was developed
which utilised the characteristic behaviour of reducingSDSand also introduced a variable
measure of confidence for each agent, hence reducing the probability of early convergence.
Two methods of measuring confidence were compared, one performed an exact calculation
and the other utilised stochastic heuristic, both performed similarly which indicated that
an exact method was not required for quorum sensing.


### 5.1 Conclusion

Section 2.1 presented the history of AI as a series of methods for producing increasingly
adaptable behaviours from artefacts. Initially each behaviour had to be defined explicitly,
such as in Hero’s Mechanical Theatre. Later, individual behaviours could be selected from
a fixed range of behaviours by reconfiguring the artefact, as with L’Ecrivain, or determined
by means of an input, as with The Jacquard Loom. Eventually, behaviours could be defined
as procedures which could logically branch depending on some internally stored data,
as would have been the case with the Analytical Engine. This series of methods reaches
a logical conclusion with the definition of the Universal Turing Machine in which data
and procedure existed within the same medium, both being represented as symbols on a
tape. Put another way, the set of behaviours that may be performed by an artefact built
upon the principles of the Turing machine is the set of behaviours which can be described
by any symbolic process. This thesis therefore concludes that AI comes of age with the
definition of the Turing machine as it provides the foundation for building systems that
can implement other systems without external reconfiguration.

Section 2.2 presented the two categories into which modern AI can be broadly categorised,
those which utilised symbolic logic as Making a Mind and those which utilised Connec-
tionist architectures as Modelling the Brain. Where projects which could be described as
attempting to make a mind initially made remarkable progress, and some genuinely useful
systems, they struggled to reach the goal of a system which performed adequately outside
of contexts which were restricted in scope, or well defined. Objections also emerged from
Philosophy and Mathematics which cast doubt on whether this was logically possible, let
alone practically achievable. Projects which could be described as attempting to model
the brain were more resistant to such arguments, as they were attempting to reproduce
the phenomena of a system which was known to produce intelligent behaviour. However
other objections emerged in which doubt was cast on whether the system could be said to
genuinely have learned a concept, and that even a successfully trained system will provide
no insight into the phenomena to researchers. This thesis therefore concludes that it is
a valuable endeavour to investigate approaches to AI that are less vulnerable to these
critiques.

Section 2.3 presented swarm intelligence algorithms as able to perform practical tasks as


well as to provide insight into the mechanisms underlying natural phenomena. Swarms are
able perform intelligent behaviours at population level due to a combination of the actions
of individuals and their interactions with each other. Swarm intelligence combines the
explicitly defined procedures characteristic of symbolic logic, and the interactions within a
population of Connectionism. This thesis therefore concludes that swarm intelligence is
an approach to AI with the potential to grant insight into natural phenomena as well as
develop various practical algorithms. Furthermore, by combining features of both making
a mind and modelling the brain, swarm intelligence is less susceptible to the critiques of
either.
Section 3.3 introduced a formalism which defined standardSDSas a set of interacting
functions. This enabled variants ofSDSto be described in terms of the behaviour which
is distinct from standardSDS, in doing so description of variants ofSDSare more concise
and the aspect of variation is more clearly identified than if the entire variant needed to be
described. This demonstrated the modularity ofSDSand the implementation of the variants
for use in experiments. This thesis therefore concludes that the formalism facilitates the
expression of variants ofSDSin literature and in algorithmic implementation.
Section 3.4 described a number of variants ofSDS. For each variant the individual level
rules that define the variant are described, as is the resulting population level behaviour.
The advantages and disadvantages of the behaviour of the variant are described including
the situation in which such behaviour is useful. This thesis therefore concludes that no
variant should be considered objectively superior to any other. Each variant represents a
trade-off of one beneficial behaviour for another, and so certain variants are simply more
suited to certain situations than others.
Section 3.5 presented the observations from a number of investigations into the group
decision making behaviours of natural swarms. Many of the individual level behaviours
and the population level behaviours had analogues inSDS. One aspect present in natural
swarms but not inSDSwas the apparent ability to sense when a certain proportion of the
swarm had reached consensus. As noted in section 3.5.3 the modes of halting all relied
on a function which analysed the entire state of the swarm and did not emerge from the
action of the individuals. This thesis therefore concludes thatSDSis a suitable model of
the decision making behaviour of the natural swarms described, and provided a means to
explore potential mechanisms for quorum sensing.


Section 4.2 introduced independent reducingSDS, a variant which modelled the observed
behaviour of ant nest site selection as closely as possible within the formalism ofSDS. This
method has two significant advantages, it demonstrated the ability to diffuse a terminating
behaviour through the swarm by individual level behaviour alone, and it exhibited the
characteristic dynamics of ant nest site selection. An experiment demonstrated the ability
of independent reducingSDSto terminate in a wide range of possible search spaces, and
with performance that was strongly correlated with standardSDS. The method had two
significant disadvantages, the mode of diffusion was unlike any which had been previously
modelled and the sensitivity to noise was too high. Section 4.3 introduced confirmation
reducingSDS, a variant ofSDSwhich used individual level behaviours that were similar
to those which had been mathematically modelled and still exhibited the terminating
behaviour of independent reducingSDS. An experiment demonstrated the ability of
confirmation reducingSDSto terminate in a wide range of possible search spaces, and
with performance that was strongly correlated with independent reducingSDS. This thesis
therefore concludes that independent reducingSDSand confirmation reducingSDSare
suitable bases for modelling the distributed decision making behaviour of ants, both being
inspired by the observed behaviour, stable enough to be valuable as a practical algorithm,
and understood as a variant ofSDS. The quorum sensing ability of both variants is greedy,
while it is true that a hypothesis with a higher score is more likely to have terminating
agents than a hypothesis with a lower score, the termination is strongly biased towards
whichever hypothesis is located first.

Section 4.4 introduced running-meanSDSwhich implemented a new method for quorum
sensing. For each iteration they remained active agents would calculate and record the
cluster size at their hypothesis. Once an agent had recorded a minimum number of values
and the mean average was over a threshold value the agent would begin terminating.
The quorum sensing behaviour was controlled by two values. The minimum number
of values recorded could be selected to determine the number of iterations at which a
cluster size must persistently be sufficiently high. The mean population size threshold
could be selected to determine the minimum hypothesis score at which an agent would
begin terminating. Running-meanSDSrequires that agents access the global state of the
swarm and perform a relatively complex calculation. Nevertheless it is able to discriminate
between hypotheses of similar scores, but at the expense of being a poor model of natural
behaviour and increased computational complexity. This thesis therefore concludes that


calculating the average mean population size at a cluster is an robust method of evaluating
the score of a hypothesis, but one which is computationally inefficient, and a poor analogue
of natural behaviour.
Section 4.5 introduced quorum sensingSDSwhich implemented a simple individual contact-
based method for quorum sensing. For each iteration they remained active agents would
poll a random agent in the swarm and if the polled agent shared their hypothesis the polling
agent would increment their confidence, in either case the confidence of the agent then
decayed by an amount proportional to its value. This was shown to have similar powers of
discrimination as running-meanSDS, and to be modulated in the same ways. Increasing
the quorum threshold increased the minimum hypothesis score at which an agent would
begin terminating, the same effect as increasing the running mean threshold. Increasing
the decay increased the number of iterations at which a cluster size must persistently by
sufficiently high, the same effect as increasing the minimum number of values recorded.
This thesis therefore concludes that the quorum sensing behaviour of quorum sensing
SDShas the same capacities as the quorum sensing behaviour of running-meanSDS, only
implemented as a stochastic process and depending on local information.
Section 4.6 examines the dynamics of ant nest site selection as an analogy of quorum sensing
SDS. As far as the analogies hold, the performance of quorum sensingSDSshows that the
method employed by ants for migration allow for individual detection of quorum sensing,
a rapid diffusion of such sensing through the swarm, robustness to noise, flexibility in the
face of many strong options or many weak options, flexibility in the face of the requirement
for a quick or a validated solution, and graceful degradation in the presence of belligerent
agents. This thesis therefore concludes that by performing a process analogous to quorum
sensingSDSthat natural swarms are able to indirectly compare the quality of a nest site
with that of another nest site, and with that of a threshold value.

This thesis has produced corroborating evidence for two hypotheses as to the nest site
selection behaviour of ants. It was observed that a swarm of ants had the capacity to
estimate the average quality of a fluctuating resource [28]. Using quorum sensingSDSas
a model for ant nest site selection predicts that ants will exhibit two difference capacities
for discrimination. Stable populations would not form at nests with an average quality
under a certain threshold as this case can be modelled as a stable cluster failing to form at
a hypothesis with a low score. Stable populations would also not form at a nest with an


average quality less than that of a nest which had already been located, as this case can be
modelled as a cluster forming at the optimal hypothesis, due to sensitivity of convergence.
Given these this prediction from the model, further work could be done to whether both of
these capacities are present.
It has also been hypothesised that the method of quorum sensing employed by ants was
based either on the rate of contact with other ants at a candidate nest site or the time before
the first encounter with another ant at a candidate nest site[78]. The ability of quorum
sensingSDSto converge to hypothesis with a high score indicates that frequency of contact
with agents that share a hypothesis is sufficient to produce this behaviour, though it may
not be necessary. Further work may therefore include experiments in which the frequency
of contact is maintained as the time before the first contact is manipulated.

### 5.2 Future work

There are three main areas left unexplored by this thesis. The difference in speed of tandem
running and transporting, the role of reverse tandem running and the role of agents which
have been removed from the swarm.
Observations of ant nest site behaviour have reported that transporting is three times faster
than tandem running [29, 28, 77], the effect of including this in quorum sensingSDScould
be investigated. One mechanism for achieving this has been hypothesised in section 4.2.3.1,
but not implemented.
Reverse tandem runs, where an ant leads another ant from a candidate nest site back to
their original nest is a situation not directly analogous to any in quorum sensingSDS. A
purpose of reverse tandem runs in nature has been investigated [77], and using a modified
version of quorum sensingSDSwhich includes reverse tandem runs may help validate
some hypotheses.

Another important aspect of ant behaviour which is not captured by quorum sensingSDS,
is that ants are often performing other behaviours than searching for a new nest. In quorum
sensingSDS, all agents are involved in the search, some will be evaluating hypotheses and
others will be terminating, but real ants have many more activities that must be performed
for a colony to survive and so must intelligently allocate time to these activities. Presumably


each instance ofSDSintends to locate a solution to a problem, a further variant could be
developed which searches for a solution as normal but also allocates resources to the
application of the current best hypothesised solution to the problem. For example, consider
a case whereSDSis being applied to find the best set of parameters for a video filter. Once
a cluster has formed a portion of the swarm could be allocated to the task of applying
the video filter to a video feed with the given parameters, the portion of the swarm being
somehow determined by the size of the cluster. This would be particularly suitable for cases
where the ideal solution changes over time. This form of online application of a solution to
a search algorithm is likely to have many applications, and would be an interesting area of
future research.

### 5.3 Impact

This thesis provides a formal specification forSDSwhich facilitates the development of
variants and their combination. A library implementing the variants mentioned in this
thesis is published online at the author ’s home page^1 and on GitHub^2 under the permissive
Apache 2.0 free software license [1].

This thesis has provided a model which corroborates some hypotheses of ant behaviour
such as indirect comparison of nest sites, comparison of nest site quality with a threshold
value, and global quorum sensing from local information. This reinforces existing work
and provides direction for investigation in the future.

This thesis collects the main variants ofSDSand details their individual use cases.

This thesis presents a nature inspired algorithm that, is stable over a wide range of possible
search spaces, and has two parameters by which the minimum solution quality threshold
and minimum hypothesis validation threshold can be conveniently tuned.

(^1) https://www.aomartin.co.uk/sds- library/
(^2) https://github.com/AndrewOwenMartin/sds



