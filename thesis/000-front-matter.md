**LOCAL HALTING CRITERIA FOR**

**STOCHASTIC DIFFUSION SEARCH USING**

**NATURE-INSPIRED QUORUM SENSING**

```
ANDREW OWEN MARTIN

andrew@aomartin.co.uk

Thesis submitted for the degree of Doctor of Philosophy

of the

University of London

Department of Computing

Goldsmiths College

April 2020
```

# Declaration of Authorship

I, Andrew Owen Martin, hereby declare that this thesis and the work presented in it is
entirely my own. Where I have consulted the work of others, this is always clearly stated.

Signed: Date:

# Abstract
Stochastic Diffusion Search (SDS) is a Swarm Intelligence algorithm in which a population
of homogeneous agents locate a globally optimal solution in a search space through
repeated iteration of partial evaluation and communication of hypotheses. In this work
a variant of SDS, Quorum Sensing SDS (QSSDS), is developed in which agents employ
only local knowledge to determine whether the swarm has successfully converged on a
solution of sufficient quality, and should therefore halt. It is demonstrated that this criterion
performs at least as well as SDS in locating the optimal solution in the search space, and
that the parameters of Quorum Sensing SDS may be tuned to optimise behaviour towards
a fast decision or a high quality solution. Additionally it is shown that Quorum Sensing
SDS can be used as a model of distributed decision making and hence makes testable
predictions about the capacities and abilities of swarms in nature.


# Acknowledgements

First and foremost, thanks must go to Prof. John Mark Bishop, my supervisor and friend
who advocated for me to be accepted on their Cognitive Computing MSc in 2009 and gave
me the courage to subsequently start a PhD. His guidance was clear and invaluable, but
always left me the freedom which makes this work entirely my own. Thanks also to Drs.
John Howroyd and Mohammad Majid al-Rifaie who provided both friendship and critical
advice.
Special thanks go to my parents Kay and Ron, and my brother Richard who supported me
in every conceivable way, consistently and substantially, and occasionally politely enquired
as to when a finished thesis may finally emerge.
Not unspecial thanks goes to the boys, Bruno, Chad, and Graham, for their regular company,
which kept me sane.

Finally, I would like to thank my wife Emilia, whose love gave me the courage to finish my
thesis, who gave me joy outside of the academic world, and who was there for me every
day, especially as I became increasingly absent as deadlines loomed.

## Contents









- 1 Introduction
   - 1.1 Aim
   - 1.2 Structure of the thesis
   - 1.3 Contributions
   - 1.4 Research questions
- 2 History of AI
   - 2.1 Historical background
      - 2.1.1 Machine behaviour
         - 2.1.1.1 Ancient automata — Clepsydra
         - 2.1.1.2 Hero’s mechanical theatre
         - 2.1.1.3 L’Ecrivain
         - 2.1.1.4 The Jacquard Loom
         - 2.1.1.5 Comparison of mechanical automata
      - 2.1.2 The question of intelligent behaviour selection
         - 2.1.2.1 Plato
         - 2.1.2.2 Aristotle
         - 2.1.2.3 Aquinas
         - 2.1.2.4 Descartes
      - 2.1.3 Artificial inner states
         - 2.1.3.1 The Analytical Engine
         - 2.1.3.2 Procedurally defined behaviour
         - 2.1.3.3 Turing computability
      - 2.1.4 Turing’s introduction of machine intelligence
      - 2.1.4.1 1948 — Intelligent Machinery
      - 2.1.4.2 1950 — Computing Machinery and Intelligence
   - 2.1.5 Definition of the Artificial Intelligence project
      - 2.1.5.1 1956 — The Dartmouth conference
- 2.2 Making a Mind versus Modelling the Brain
   - 2.2.1 Making a Mind
      - 2.2.1.1 1956 — The logic theory machine
      - 2.2.1.2 1958 — The Physical Symbol System Hypothesis
      - 2.2.1.3 1959 — The General Problem Solver (GPS)
      - 2.2.1.4 1964 — Dendral-64
      - 2.2.1.5 1972 — SHRDLU
   - 2.2.2 Critiques of Making a Mind
      - 2.2.2.1 1973 — The Lighthill Report
      - 2.2.2.2 1980 — The Chinese Room Argument
      - 2.2.2.3 Domain specificity
      - 2.2.2.4 The Common Sense Problem
      - 2.2.2.5 The first step fallacy
   - 2.2.3 Modelling The Brain
      - 2.2.3.1 Associationism
      - 2.2.3.2 1943 — McCulloch and Pitts model of the neuron
      - 2.2.3.3 1949 — The Organization of Behaviour
      - 2.2.3.4 1958 — Mechanisation of thought and the Perceptron
      - 2.2.3.5 1969 — Perceptrons
      - 2.2.3.6 1981 — Hinton mapping
      - 2.2.3.7 1986 — Parallel Distributed Processing
      - 2.2.3.8 Comparison of symbolic AI and neural networks
   - 2.2.4 Critiques of Modelling the Brain
   - 2.2.5 The state of the art
- 2.3 Swarm Intelligence — Mind is social
   - 2.3.1 1987 — Boids
      - 2.3.2 1992 — Ant Colony Optimisation (ACO)
      - 2.3.3 1995 — Particle Swarm Optimisation (PSO)
      - 2.3.4 2014 — Dispersive Flies Optimisation (DFO)
   - 2.4 Summary
- 3 Stochastic Diffusion Search (SDS)
   - 3.1 Introduction toSDS
      - 3.1.1 The Restaurant Game
      - 3.1.2 The Mining Game
      - 3.1.3 Pseudocode
   - 3.2 Mathematical analysis ofSDS
      - 3.2.1 Discrete Dynamical Systems model
      - 3.2.2 Minimum convergence criteria
         - 3.2.2.1 Robustness
      - 3.2.3 Convergence time
         - 3.2.3.1 Time to first hit (TH)
         - 3.2.3.2 Positive feedback effect of cluster formation
         - 3.2.3.3 Stability of convergence
      - 3.2.4 Sensitivity of convergence
      - 3.2.5 Steady state resource allocation
         - 3.2.5.1 Estimating optimal hypothesis score from steady state
   - 3.3 A formal specification forSDS
      - 3.3.1 Areas of potential variation inSDS
      - 3.3.2 Formalism
      - 3.3.3 StandardSDS(SSDS)
      - 3.3.4 Omissions of the formalism
         - 3.3.4.1 Initialisation
         - 3.3.4.2 Extraction
   - 3.4 Variants ofSDS.
      - 3.4.1 Implementation variants
         - 3.4.1.1 Asynchronous iteration
      - 3.4.1.2 Private internal state
      - 3.4.1.3 Limited connectivity
      - 3.4.1.4 Active diffusion
      - 3.4.1.5 DeterministicSDS
   - 3.4.2 Convergence variants
      - 3.4.2.1 Multi-testing
      - 3.4.2.2 Multi-diffusion
      - 3.4.2.3 The hermit
      - 3.4.2.4 The secret optimist
   - 3.4.3 Exploration variants
      - 3.4.3.1 Context-free diffusion and context-sensitive diffusion
      - 3.4.3.2 Hypothesis transmission noise
      - 3.4.3.3 Comparative partial evaluations
   - 3.4.4 Heuristic variants
      - 3.4.4.1 Fixed heuristics
      - 3.4.4.2 Adaptive heuristics
   - 3.4.5 Halting variants
      - 3.4.5.1 Time based halting
      - 3.4.5.2 Cluster size based halting
      - 3.4.5.3 Convergence based halting
      - 3.4.5.4 Combined halting methods
   - 3.4.6 Summary of variants ofSDS.
- 3.5 Natural analogues ofSDS.
   - 3.5.1 Ant nest site selection
   - 3.5.2 Bee nest site selection
   - 3.5.3 Comparisons betweenSDSand nest site selection in ants and bees
   - 3.5.4 Mechanism of quorum sensing in ants
      - 3.5.4.1 Selection of quorum threshold in ants
   - 3.5.5 Mechanism of quorum sensing in bees
   - 3.5.6 Mechanism of quorum sensing in bacteria
      - 3.5.7 Comparisons betweenSDSand quorum sensing in nature
- 4 Local termination criteria forSDS
   - 4.1 Introduction of reducingSDS
   - 4.2 Independent reducingSDS.
      - 4.2.1 Robustness of independent reducingSDS
         - 4.2.1.1 Results
      - 4.2.2 Diffusion of termination in independent reducingSDS
         - 4.2.2.1 Results
         - 4.2.2.2 Plot of swarm evolution
      - 4.2.3 Discussion
         - 4.2.3.1 Analogies with nature
   - 4.3 Confirmation reducingSDS
      - 4.3.1 Robustness of confirmation reducingSDS
         - 4.3.1.1 Results
      - 4.3.2 Diffusion of termination in confirmation reducingSDS
         - 4.3.2.1 Results
         - 4.3.2.2 Plot of swarm evolution
      - 4.3.3 Discussion
   - 4.4 Running-meanSDS
      - 4.4.1 Greediness of running-meanSDS
         - 4.4.1.1 Results
      - 4.4.2 Discussion
   - 4.5 Quorum sensingSDS
      - 4.5.1 Experiment on the robustness of quorum sensingSDS.
         - 4.5.1.1 Results
      - 4.5.2 Experiment on the effect of decay
         - 4.5.2.1 Results
      - 4.5.3 Discussion
         - 4.5.3.1 Effect of quorum threshold
         - 4.5.3.2 Effect of decay
         - 4.5.3.3 Comparison of running-meanSDSwith quorum sensingSDS
   - 4.6 Differences between quorum sensingSDSand ant nest-site selection
   - 4.7 Conclusion
- 5 Conclusion and Future Work
   - 5.1 Conclusion
   - 5.2 Future work
   - 5.3 Impact
- 6 Glossary
- 7 SDS Formalism
- 8 Acronyms
- 9 Mathematical symbols
- Bibliography
- A Tables of results
      - tion reducingSDS A.1 Speed of diffusion of consensus in independent reducingSDSand confirma-
   - A.2 Robustness of reducingSDS
- 2.1 Ctesibius’ indicating water clock. List of Figures
- 2.2 Hero’s Mechanical Theatre
- 2.3 L’Ecrivain
- 2.4 Portrait of Jacquard woven on a Jacquard loom
- 2.5 Example input script for the Script Applier Mechanism
- 2.6 Example session with the Script Applier Mechanism
- 2.7 The McCulloch and Pitts model of the neuron
- 2.8 Hinton Mapping
- 2.9 Reynolds’ Boids
- 3.1 Myatt’s discrete dynamical systems model ofSDS
- 3.2 Flow chart of ant emigration behaviour
- 4.1 Cluster size evolution over time for independent reducingSDS.
- 4.2 Cluster size evolution over time for confirmation reducingSDS.
- 4.3 Effect of varying quorum threshold on the halt status of running-meanSDS
- 4.4 State of agents in running-meanSDSover time
- 4.5 Effect of varying quorum threshold on quorum sensingSDS
- 4.6 Effect of varying quorum threshold on quorum sensingSDS
   - gence 4.7 Effect of varying quorum threshold on the probability of successful conver-
   - successful convergence 4.8 Effect of varying quorum threshold on the number of iterations before
- 2.1 XOR training set List of Tables
- 2.2 Augmented XOR training set
- 3.1 Robustness ofSDSutilising passive, active and dual polling
- 3.2 Comparison of Context-freeSDSand Context-sensitiveSDS
- 4.1 Robustness of independent reducingSDSwith varing search space size.
- 4.2 Correlations with independent reducingSDS
- 4.3 Robustness of confirmation reducingSDSwith varing search space size.
- 4.4 Correlations with confirmation reducingSDS
- 4.5 Effect of varying decay
- A.1 Stability of cluster formation of reducingSDS
- A.2 Robustness of reducingSDS
- 1 Ant Colony Optimisation List of Algorithms
- 2 PSO
- 3 SDSas introduced by Bishop (1989)
- 4 A single iteration of standardSDS.
- 5 SDSas formalised
- 6 ISYNCHRONOUS— Synchronous iteration
- 7 DPASSIVE— Passive diffusion
- 8 DHUNIFORM— Uniformly random hypothesis selection
- 9 TBOOLEAN— Boolean testing
- 10 T MUNIFORM— Uniform microtest selection
- 11 HFIXED— Fixed iteration count halting
- 12 IASYNCHRONOUS— Asynchronous iteration
- 13 IPARALLEL— Parallel iteration
- 14 DPASSIVE— Private internal state diffusion
- 15 DACTIVE— Active diffusion andTACTIVE— Testing for active diffusion
- 16 TMULTI-TESTING— Multi-testing and example combinators
- 17 DMULTI-DIFFUSION— Multi-diffusion and example combinators
- 18 DHERMIT— Hermit diffusion
- 19 TOPTIMIST— Secret optimist testing
- 20 DCONTEXT-FREE— Context-free diffusion
- 21 DCONTEXT-SENSITIVE— Context-sensitive diffusion
- 22 DNOISE— Noisy diffusion and Gaussian noise
- 23 TCOMPARATIVE— Comparative testing
- 24 HTIME— Fixed wall-clock time halting
- 25 HINDEFINITE— Indefinite halting
- 26 HUNIQUE— Unique hypothesis count halting
- 27 HLARGEST— Largest cluster size halting
- 28 HACTIVITY— Global activity threshold halting
- 29 HSTRONG— Strong halting
- 30 HWEAK— Weak halting
- 31 HSTABLE— Stable global activity halting
- 32 Example combined halting
- 33 TREDUCING— Reducing testing
- 34 HREDUCING— Empty or all terminating swarm halting
- 35 DINDEPENDENT— Independent reducing diffusion
- 36 DHINFINITE— Noise hypothesis selection
- 37 HCOLLAPSE— Optimal hypothesis cluster collapse halting
- 38 DCONFIRMATION— Confirmation reducing diffusion
- 39 DRUNNING MEAN— Running mean diffusion
- 40 DQUORUM SENSING— Quorum sensing diffusion



