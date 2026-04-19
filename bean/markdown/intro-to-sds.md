> ```
> INITIALISE (mappings);
> REPEAT
>     TEST (mappings);
>     DIFFUSE (mappings);
> UNTIL TERMINATION;
> ```
> 
> SDS as Introduced by Bishop (1989)

# Stochastic Diffusion Search

A search algorithm is the used to help find a preferred location in a search
space, this is often as simple as the largest number in a list, or an ideal
location in on some kind of map. 
There are many search algorithms each with their own pros and cons. You can
check every option, but only if your list of options isn't too big, you can
predict where the best option might be if there's some order to your list and
start there, or you can do some random sampling which relies on statistics and
will probably, but not always, outperform other options.
Stochastic Diffusion Search is a complicated sounding name for a simple
process, which is good at quickly getting you a decent answer in complicated
circumstances.

Put simply, to do a Stochastic Diffusion Search (which I'll call SDS from now on), you have a number of "agents" where each agent is investigating a single spot in a large search space and is either "active" or "inactive".
For "agent" you can imagine simple robots, or ants. For "active" or "inactive" you can imagine "happy" or "sad".
Then the action of SDS requires performing two actions called a "Diffusion phase" and a "Test phase".
The purpose of a "Diffusion phase" is to give each agent something to investigate.
The purpose of a "Test phase" is for each agent to do a bit of an investigation and then become active or inactive.
If you alternate between doing a "Diffusion phase" and a "Test phase" the agents will gradually congregate around the best option.

