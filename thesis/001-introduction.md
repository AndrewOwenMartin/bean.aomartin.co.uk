## 1 Introduction

# Introduction

### 1.1 Aim

This work aims to identify swarm intelligence as an approach to Artificial Intelligence (AI)
which provides a complimentary direction of research to the current established methods.
The historical development of artificial intelligence is described and the strengths and
limitations of the two main approaches that dominate its modern form are examined.
This is in order to show that swarm intelligence can be considered to be a third way in
which to explore artificial intelligence which shares some significant features with the two
other approaches and yet is distinct. By examining the many published variants of an
existing swarm intelligence algorithm, Stochastic Diffusion Search (SDS), we will aim to
show that a diverse range of behaviours can emerge from a swarm as a result of changes in
the behaviour of the individuals and that each variant introduces disadvantages as well
as advantages. We develop a new variant, ReducingSDS, to demonstrate its ability to
propagate halting behaviour within a swarm rather than relying on an external process
and to potentially provide insight into distributed decision making observed in the natural
swarms. Two further variants are introduced, Running-meanSDS, and Quorum sensing
SDS. Running-meanSDSdemonstrates capacity for robust and flexible distributed decision
making using an exact method. Quorum sensingSDSdemonstrates similar capacities but
employs a simple stochastic individual behaviour. Both variants have parameters, the
effect of which is investigated, showing that they can be selected to optimise performance
for a desired outcome, and that the algorithm is stable over a wide range of parameters.


### 1.2 Structure of the thesis

In identifying the value of swarm intelligence as a method of investigation some key events
in the history of automatic performance of intelligent behaviour are examined. Starting
with the fully defined clepsydra of the ancient world we see artefacts that can produce
a single complex behaviour by virtue of their construction. Eventually machines were
developed which had the ability to be reconfigured to perform variations on a single task.
Given as examples are L’Ecrivain of 18th century Switzerland, which could ink a message
desired by the user, and the Jacquard Loom of 19th century France, which could weave
patterns of great complexity as determined by a sequence of punched cards.

The next development that is significant for this investigation is when machines could
be configured to perform distinctly different tasks as well as variations of those tasks.
The Analytical Engine of Charles Babbage is an early example of a machine which used
one medium, punched cards in this case, to procedurally define its behaviour, as well
as specifics of that behaviour. Where L’Ecrivain could produce many messages and the
Jacquard Loom could produce many patterns, the Analytical Engine in principle could both
produce patterns and produce messages. The notion of procedurally defined behaviours
was most significantly developed when Turing in 1936 defined a formalism for mechanical
procedures, from this formalism Turing proposed what became known as the Universal
Turing Machine in which definitions of mechanical procedures were represented in exactly
the same medium as the input and output, symbols printed on a tape. The significance of
the Universal Turing Machine was that a single machine could be built which would be
able to perform any and all mechanical procedures that were possible to define. In practice
many mechanical procedures exceed practical limits such as requiring too much time or
too much ‘tape’, but as Universal Turing Machines developed in the form of electronic
computers the limits were pushed ever back.

Turing’s subsequent work included working towards the invention of the electronic com-
puter which would be a practical example of the Universal Turing Machine, and investiga-
tions into whether any of the mechanical procedures that could be implemented on such a
machine would produce human-level intelligence. Significantly Turing included emphasis
on how achieving this aim would be detected, and introduced the notion of designing
machines to perform quintessentially human traits such as game playing. By 1956 a project


was proposed based on the notion that all aspects of intelligence could be described as a
mechanical procedure that could be implemented in a machine. The subject of the project
was eventually named “artificial intelligence” and the subsequent investigations thereof
can broadly be separated into two categories, that of making a mind vs modelling a brain,
both of which have their own advantages and successes and both of which have been
philosophically critiqued as being at best practically challenging and at worst logically
impossible.

While the artificial intelligence project progresses in the presence of this dichotomy a related
project, swarm intelligence, aims to discover and take advantage of the mechanisms by
which a group of individuals may act such that from their combined behaviour a global
activity emerges which appears to be more complex or intelligent than could be attributed to
any individual. Swarm intelligence can also be seen as a third way between the approaches
of artificial intelligence, in one sense each agent is defined explicitly, analogous to the
symbolic logic procedures of ‘making a mind’ and the result of the system is produced by
interactions between the elements, analogous to the connectionist architecture of ‘modelling
the brain’. Furthermore swarm intelligence has a feature that is not strongly present in
either of the artificial intelligence approaches, that the evolution of the global state of the
system is determined by the global state of the system itself, rather than any predetermined
logic, or architecture.

We examine some algorithms which produce behaviour best described as a global state
behaving intelligently emerging from interactions of relatively simple individuals. These
algorithms are interesting for two reasons, they may be feasible ways of solving existing
practical problems, and as they are characterised neither by making the mind or modelling
the brain they may offer insight as to a way to progress in the artificial intelligence project
against which the existing philosophical criticism does not hold. We also look at some
observations of similar behaviour in natural swarms, this also has a twofold purpose,
observations of natural behaviour may offer insights into the design of existing swarm in-
telligence algorithms and unanswered questions about natural behaviour may be explored
by comparison with analogous behaviour in swarm intelligence algorithms, in this way we
may even be able to explain natural behavioural phenomena by explaining the analogous
phenomena in swarm intelligence algorithms.

We pay particular attention toSDSas a good example of a swarm intelligence algorithm


which: employs a swarm of simple individuals; can be analysed mathematically to predict
its performance over a wide range of situations; produces useful and distinct behaviours
as a result of small changes in the manner in which members of the swarm interact. We
list the mathematical analysis ofSDSwhich are used to evaluate and compare its many
variants. We develop a syntactic model to describe variants ofSDSand hence highlight
their differences. We look at a number of variants that may be described by this model and
hence demonstrate the range of emergent behaviours that are achievable through changes
in individual behaviour, even though the changes themselves may initially appear to be
minor.

We introduce the variant ReducingSDSinspired by a question of how certain species of ants
detect quorum in their collective decision making processes and perform an experiment to
show that behaviour analogous to that observed in ants can be performed bySDS.
Building on the successful proof of concept, a further variant is developed Quorum sensing
SDSwhich combines the novel mechanism of ReducingSDSwith features of the previously
examined variants ofSDS, we see that the new variant is a robust and effective search
algorithm.
Finally this work will be critically examined, the contributions and shortcomings are listed
and areas of potential further work are identified.

### 1.3 Contributions

The expected contributions of this work are a summary of the key moments in the develop-
ment of AI, a study of the strengths and weaknesses of the variants ofSDS, a demonstration
of a mechanism whereby individuals in a swarm may infer information about the global
state of the swarm, and a practical algorithm for effective searching of a wide range of
search spaces.

### 1.4 Research questions

```
Given the success of algorithms which perform well defined actions over data structures
and of artificial neural networks which produce useful behaviour as a result of a learning
```

process, identifying the value in studying the abilities of swarms which are neither a
completely controlled process or a learning structure.

The useful behaviours which can emerge from a swarm as a result of the actions of the
individuals, and how do these behaviours compare with each other.

Whether individuals in a swarm intelligence algorithm can access information about the
global state of the swarm through local stochastic processes, and if these behaviours are
analogous to those observed of natural swarms.

That these observations may be combined to produce a practical and robust swarm intelli-
gence algorithm.



