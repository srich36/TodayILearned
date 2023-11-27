# Overview

- Original paper: *Direct Preference Optimization: Your Language Model is Secretly a Reward Model*
- Background
  - RLHF [(notes)](./Reinforcement_Learning.md)
  - RLHF uses a separate *Reward Model* in addition to the language model to evaluate the quality of the response
- Direct Preference Optimization (DPO) is an alternative to RLHF
- **DPO optimizes for human preferences without explicit reward modeling or reinforcement learning**
- Language models go through unsupervised training so it is difficult to have direct control over their outputs
  - To have more control, RLHF is used
- RLHF is a complex and unstable procedure (two separate models, not wanting to drift far from the original model)
- DPO is lightweight, stable, and performant (among other benefits), and is as good or better than RLHF
- Why do we need to align our models with human intent?
  - e.g. we want our models to understand incorrect code, but write correct code
  - We want models to know of common misconceptions, but not repeat common misconceptions
  - **Selecting the model response from a very wide range of knowledge and abilities is crucial**
- This paper shows that the existing RL-based objective in RLHF can be optimized exactly with a simple binary cross-entropy
objective which greatly simplifies the learning process
  - More formally, this is a reward maximization with a KL-divergence constraint (divergence from the original language model)
- DPO also uses a preference model (human labeling is used to build a mathematical preference model, but more powerful language models can also be used)
  - However, instead of having to train a Reward model from this preference model, DPO uses a change of variables to define
  the preference loss as a function of the policy directly
  - Thus, given a dataset of human preferences over model responses, DPO can optimize a policy using a simple binary cross entropy objective
- Why can this even be done?
  - The original RLHF as formulated **is not differentiable** and thus cannot be used to optimize the model directly -- reinforcement learning is needed


## DPO

- DPO is designed to derive a simple optimization algorithm for policy optimization using preferences directly
- This approach bypasses the reward modeling step and directly optimizes a language model using preference data
- The key insight
  - Leverage an analytical mapping from reward functions to optimal policies
  - This enables rewriting of the loss function to **not** include the reward function, thus making it optimizable without the
  reward modeling step
- This is essentially some equation rewriting to express one of the key unknowns (reward function) as other 
variables that are more easily optimized
- This is a lot of math. The key point is given a dataset of human preferences, DPO is much easier (and as effective) as RLHF