## Terminology

- *Agent* - An entity that takes actions
  - e.g. A robot, a self-driving car, a human, etc.
  - The algorithm itself is the agent
- *Environment* - The world that the agent interacts with
  - e.g. The physical world, a video game, etc.
- *Action* - The behavior that the agent can take
  - e.g. Moving left, moving right, jumping, etc.
- *Action space A* - The set of all possible actions (this may be discrete or continuous)
- *Observation* - How the environment responds back to the agent
  - Observations are reports of states and rewards
- *State* - A concrete/immediate situation that the agent is in at a moment
- *Reward* - A scalar value that the agent receives from the environment that is a measure of how well the agent is doing
- *Deep Q Networks (DQN)* - A neural network designed to learn the `Q` function
- *Policy Function* - `pi(s)` - Given a state, which is the best action to take

## Examples 

- AlphaGo 
  - This used a supervised learning approach to bootstrap a decent agent
  - Then, it used reinforcement learning approach by playing against itself to improve it beyond human-level performance
- AlphaGo Zero
  - This used a reinforcement learning approach from the start (without any human supervision)
- AlphaStart (Starcraft)
- OpenAI Five (Dota 2)

## Deep Reinforcement Learning (Deep RL)

- The key idea of reinforcement learning is to learn without any human supervision, by interacting with the environment and 
learning from the outcomes of those interactions

### Classes of Learning Problems

- Supervised learning
  - We are given input data, and labels y
  - The goal is to learn a function that maps the input data to the labels
  - This is supervised because we are providing the labels
- Unsuperivsed learning
  - We are given input data, but no labels
  - The goal is to learn the underlying structure of the data
  - This is unsupervised because we are not providing the labels
- Reinforcement Learning
  - Given data in state-action pairs 
    - *States* - observations that the neural network can see
    - *Actions* - behaviors that the agent can take based on the states
    - *Rewards* - The goal is to maximize the future rewards over time steps

### Reinforcement Learning Key Concepts

- Total Reward (`R_t`) - The sum of all rewards over time
- Discounted Sum - A `gamma` variable defined that applies discounts to rewards that achieved in the future
  - This enforces some short-term greediness in the algorithm
- The `Q` function -- this is the foundation of algorithms
  - The goal of this function is to see given a state, you can find the best action to take
  - This captures the expected total future reward for taking action `a` in state `s`
  - `Q(s, a) = R_t | s, a`

### Deep Reinforcement Learning Algorithms

- Value Learning
  - Determine the `Q` function via deep learning
  - Value learning tries to use deep learning to estimate the Q function
  - Use the `Q` function to determine the best action to take
- Policy Learning (Policy Gradients)
  - First try to directly optimize the policy
    - What action to take in a given state
  - If we can directly optimize the policy, we don't need to learn the `Q` function and can directly take the action

### More on the `Q` function

- **It can be very difficult even for humans to accurately estimate Q-values**
- Deep Q Networks (DQN)
  - Take in a state
    - e.g. screenshot of the environment, etc.
  - Take in an action
  - Output: A single number that is the expected `Q` value for that state-action pair
  - This is the naive approach, but would require us to run the network for each action in the action space
  - Instead, we can have the network output a vector of `Q` values for each action in the action space
    - This is called the *action-value function*
    - This is the approach used in DQNs
- So, to recap, a DQN 
  - Takes in input the `state`
  - Outputs a vector of `Q` values for each action in the action space
- The policy function can thus be defined as:
  - `argmax_a Q(s, a)`
  - This is the action that maximizes the `Q` value for a given state

#### DQN Networks

- The loss function is stateful
  - Start with an initial reward plus the discounted sum of all the best future action rewards
  - Take the squared difference between the optimal `Q` value and the actual `Q` value predicted
- After selecting an action, the action gets sent to the agent which executes it in the environment
  - Now, the environment transitions to a new state
    - There is a new state `S'`
    - The environment provides a reward signal `R` (a scalar value)
    - The agent uses this data to update the `Q` function
    - This happens for many iterations until a proper `Q` function is learned
- Downsides of Q-learning
  - It's good for handling discrete action spaces, but not continuous action spaces
  - The policy function is determisitic
    - This means that the same state will always result in the same action
    - This is not good for exploration and having the agent try new things
    - This is not good for stochastic environments
- To address these shortcomings, policy gradient algorithms (policy learning) try to build a neural network to directly learn policy functions from the data

## Policy Gradient Algorithms

- Goal: Train a network that outputs a probability distribution that selecting an action given a state is the best action to take
  - **We don't care about the value of each action (like in a Q function) we only care about if it's the best action to take**
  - This is why we're learning a policy function, not a value function like in DQNs
- Because this outputs a probability distribution, we can sample from this distribution to get the action to take
  - This allows for stochasticity in the policy function
  - **Probability distributions allow this to be used in a continuous action space**
- **The output probability distribution of the policy function must sum to 1**
  - This helps make it easier to train the network
- **The output of the policy function network is no longer a vector**
  - The output is the mean and variance of the distribution

### Training Policy Gradients - Case Study

- Case study: self-driving cards (simplified example)
  - Agent: The car
  - State: Camera, lidar, etc.
  - Action: Steering angle
  - Reward: Distance traveled 

**Training Algorithm**

Training in policy gradients requires both data collection and optimization

1. Initialize the Agent
2. Run a policy until termination
3. Record all states, actions, and rewards that were taken until termination
4. Training step #1 -- Decrease the probability of actions that resulted in low rewards (actions taken closer to crash)
   - Increase the probability of actions that resulted in high rewards (actions taken further from crash)
5. Repeat this over and over again until the agent converges 

- **This is super interesting because the car learned on its own. It never learned about the physics of the car, 
what a road is, etc.**

- How can we formalize steps #4 and #5?
  - Loss: `-log(pi(a | s)) * R_t`
    - `pi(a | s)` - The probability of taking action `a` given state `s`
    - `R_t` - The total reward
    - This is designed to penalize actions that have high rewards and low probabilities 
- A standard gradient algorithm can be used to optimize the actions to take
  - If you are optimizing the policy function, you can use gradient ascent to maximize the probability of taking the best action

- In real-life, we can't run a policy until termination (e.g. if it's a car)
  - One way around this is to try and train this in simulation
  - Modern simulation environments in reality **do not** capture the phenomenon of the real world
    - This is called the *reality gap*
    - This is a huge problem in robotics
    - This is why we can't just train a policy in simulation and expect it to work in the real world
  - Photo-realistic simulators (like [VISTA](https://vista.csail.mit.edu/) from MIT) are simulators that use real
  photos to eliminate the sim to real gap
    - This worked to train a sample self-driving car in the real world

### RLHF

- Writing a loss function to capture what is "better" in an LLM response is extremely difficult
  - What if we could use human preferences to help with that loss function instead?
- RLHF uses methods from reinforcement learning to use the human feedback to directly optimize a language model
- Once we have an LLM, the next step in RLHF is to train a **reward model**
  - This is how human preferences are integrated into the system
- Reward model
  - The goal is to train a model that takes in a sequence of text and returns a scalar reward which 
  should numerically represent human preference
  - There are multiple ways to implement this but a scalar output is required
    - e.g. This could be another language model fine-tuned or trained from scratch on the preference data
- Training the reward model (RM)
  - Human annotators rank the text outputs from the LLM
    - These rankings are relative to other outputs to remove noise, differences in ranking amongst annotators, etc.
    - The head-to-head Elo system is most commonly used for this
  - These rankings are normalized into a scalar reward signal for training
  - Now that we have an initial LLM to generate text, and a reward model to rank it, we can use
  reinforcement learning to optimize the original language model with respect to the reward model
  - In this finetuning, a large number of parameters are frozen and a policy gradient algorithm *Proximal Policy Optimization (PPO)* is used
- Formalized definitions for RL in LMs
  - Policy - A language model that takes in a sequence of text and outputs another sequence of text
  - Action space - All the tokens of the language model
  - Observation space - The distribution of possible input sequences (quite large)
  - Reward function - A combination of the preference model and a constraint on policy shift
- Tying this all together
  - Given a prompt `x`, `y` text is generated 
  - Concatenate `x` and `y` to get the full text, and feed this to the reward model for evaluation
  - Per-token probability distributions from the in progress finetuning model and the original model are compared to ensure
  the RL isn't making the RLHF finetuned model stray too far from the original model
    - This ensures the LM doesn't output gibberish that fools the reward model
  - The *update rule* is the parameter update from PPO that maximizes the reward metrics on the given batch of dataG

#### Downsides

- Have to train two separate models
- This is complex and unstable as you don't want the finetuned LM to drift far from the original LM

### Miscellaneous Notes

- RL is very useful because you can run thousands of simulations in parallel
  - This allows you to get to a better solution faster
