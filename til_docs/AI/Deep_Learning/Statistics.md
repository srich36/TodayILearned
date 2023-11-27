# Terminology

- *Double Descent* - The phenomenon where the test error of a model decreases, increases, and then decreases again as the model size increases
  - This is a phenomenon that occurs in deep learning models
- *Robustness* - If you change the input a little bit, the output doesn't change much
  - Robustness is when the change in input is proportional to the output
- *Lipschitzenss* - A function is Lipschitz if a check in input by `e` ideally results in a change in output by `e`
- *MNIST dataset* - A dataset of handwritten digits commonly used for training image processing systems
- `Effectiv Dimensionality` - `d_eff` -- in a dataset (e.g. an image) the effective dimensionality is the important part of the dataset
  - Not every pixel is important
  - For example, MNIST has `d_eff` ~ 10^1 even though the full dimensionality is 10^3
  - It is hard to determine the effective dimensionality of a dataset without building and training a model

# Overview

- The size of models is growing exponentially
  - We're in the ballpark of trillions of parameters
  - This also holds true to time-series modeling, etc.

## Math

- Why does bigger seem to be better?
  - We need `n` equations to solve `n` unknowns 
  - Today's models have millions of parameters that are trained on < a million data points
  - What are we learning here? Where is 
- Generalization bound is proportional to the number of parameters divided by the dataset size
  - It's the square root of this
- The *ImageNet* dataset is 1.4 million images 
- Classical statistics told us that as we hit a point where loss starts to increase, we stop training
  - **However, in reality, there is a second descent** -- this is the *double descent* phenomenon
  - This has been observed across many different architectures 
  - At the end of the second descent, the model is *slightly* better than the first descent
- As networks get bigger networks can start to generalize across tasks
- Parameter scale also improves robustness
- Not everything improves with scale
  - Bias increases with scale
  - **Reasoning about the data stays the same with scale**
- The second part of the ascent is called an *overparameterized regime*
  - This is where the number of parameters is greater than the number of data points
  - This is where the model starts to memorize the data
  - This is where the model starts to overfit

### Robustness 

Note: **This section is great for identifying how many parameters you need to train a model**
- e.g. Imagenet is `d_eff` ~ 10^3, n ~ 10^7, so we'd need ~10^10 parameters
  - No one has trained a network this large 

- As we start increasing the number of parameters there is a jump in robustness
  - This has been confirmed by experiment
- A paper came out that formalized this - *Scale is a law of robustness*
    - Fix a reasonable function (pretty much any continuous function) `f` with parameters `p` 
      - This is representative of a neural network
    - Sample `n` points from a "high dimensional" space (e.g. a 256x256x3 image -- the 3 is RGB)
        - Add label noise
    - Then, to memorize this data set (you need to fit every data point in training below a certain noise level)
    and to do this robustly you need dramatic overparameterization
      - Parameter count needs to be *At least* = `n` * `d`
        - `n` is the number of data points in your data set
        - `d` is the dimensionality of the input
      - This is the number of parameters you need to memorize the data set
      - **This is a huge neural network but this is a fundamental law of robustness**
  - Why is this?
    - Because this gives us as many unknowns (parameter count) as the `n` * `d` equations
- In robustness (overparameterization)
  - We get great generalization
  - More robustness
  - Negatives: bias, cost, energy, etc.

### Examples

- The MNIST data point has `n` ~ 10^5 and `d` ~ 10^3
- In practice, robustness doesn't need to meet the Libschitzness criteria, it can be a little more off
  - Thus you can get robustness for a neural network with a parameter count of ~10^6
- `d_eff` - The `d_eff` of MNIST is ~10^1, which is why a parameter count of 10^6 is sufficient

### Reasearch Notes - Getting Past Overparameterization 

From this [talk](https://www.youtube.com/watch?v=p1NpGC8K-vs&list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI&index=9)

- Took inspiration from the human brain and how neurons interact
- This formulation theoretically allows for more powerful models
  - expressivity, causality, robustness, memory, etc.
- The interaction between two neurons in a brain is a continuous process
- **Synaptic release in the brain is much more than a scalar weight**
  - In the real brain there is a probability distribution of how one neuron affects another
  - In neural networks so far, we've just used a scalar weight
- In brains there is a lot more memory, recurrence, etc.
- What if we incorporated these building blocks into how we build neural networks?
- Exploring continuous time process neural networks
  - (CT) RNN - continuous time recurrent neural network
- When using these models in practice, a simple LSTM network will outperform this
- So, this research proposes a *Liquid Time-Constant (LTC) network*

### Liquid Time-Constant (LTC) Networks
- LTCs are a type of continuous time process neural network that operate on time-series data
  - This system is input-dependent; the behavior of the neural network changes based on the input
  - **You can control a network with very-few parameters in a LTC**
    - This is actually really interesting because it means the network is more understandable
    - I wonder why people aren't exploring this more?
  - LTCs learn the cause and effect of a task better than other networks
  - These networks can achieve robustness without overparameterization
- The researcher's idea for why Liquid neural networks can bypass the law of robustness is `d_eff`
  - Liquid neural networks can extract much more out of a dataset, thus `d_eff` is much lower
- LTCs also have different types of neurons
  - This is similar to how the brain has different types of neurons
  - This allows for more expressivity and for you to know what neurons are doing what
- LTCs generalize better to other unseen scenarios than other networks
- These networks are very compact and can run on edge devices
- Downsides
  - LTCs require time-series data to operate (e.g. videos) and can't extract the same information from static images
  - They struggle to learn long-term dependencies (vanishing gradient problem, see [RNNs](./RNNs.md))