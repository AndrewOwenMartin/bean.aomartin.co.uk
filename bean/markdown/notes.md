# adaptive halting

after a stable cluster of a certain size has been detected (cluster detection is it's own field) we could do something which means the minimum stable cluster size is this new value 

context free SDS seems to do this already for "free" but at the cost of a slightly increased minimal threshold. 

is there a known mechanism for setting the min threshold? not studied, but I think a variable 0-0.5 which is the probability of skipping test phase and becoming inactive will do it. or the same but for skipping test and becoming active.

# Microtest design

you need each Microtest to return a Boolean. 

a Microtest which probabilistically returns a boolean is equivalent to a set of tests where the probability of selecting a passing test is equal to the probability of the test passing. 

Microtests can return a scalar value but some further action is required to determine how the agent will act in the diffusion phase. a simple solution is to apply a fixed threshold. though this is equivalent to a implementing the fixed threshold in the microtests 

# thoughts

do training a mlp with SDS. find micro tests which copy back prop

is mutating a hypothesis during diffusion the same as generating new hypotheses from combining existing hypothesis? 

what is the tradeoff for context free?

can you train an n-tuple network?

how much you evaluate a search space and if you have fixed micro tests which variables can you use to tune your performance? 

mutating hyp gets you hill climbing. but how do you detect clusters?<
