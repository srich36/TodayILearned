## Terminology

- *Deep learning* - A subset of machine learning that uses neural networks to learn from data
  - Deep learning focuses on models structured like the human brain
  - This is about teaching computers how to learn a task directly from raw data
- *Machine learning* - The ability to learn without being programmed
- *Artificial intelligence* - A general concept that allows computers to think and act without human intervention
    - Deep learning is a subset of machine learning which is a subset of AI
- *Features* - Certain patterns in the data that help the model make predictions
  - examples: lines, edges (low-level), eyes, ears (mid-level), faces (high-level)
  - features are not just visual, they are often quantitative, abstract, etc. 
- *Hidden layer*  - A layer of neurons that is intermediate and is not the input or the output
- *Forward Propagation* - Input data is fed into a neural network, that is used to compute an output, and that output is optionally
passed to more layers to compute the final output
- *Feed Forward* - Describes the architecture of a neural network where information moves in one direction and there are no cycles
- *Hyperparameters* - Parameters that determine the network structure and how the network is trained
  - Examples: learning rate, number of hidden layers, number of epochs, batch size, etc.
- *Layer* - A collection of neurons that are connected to the same inputs and output
  - In a feed forward model this is just one step of the feed forward process (inputs -> layer 1 -> layer 2 -> output)
- *Neuron* - Represents one unit in a neural network -- it takes inputs, applies a function to them, and produces an output
  - A perceptron is a subset type of a neuron in a neural network

### Mathemtical Terms

- `x` - Input vector
- `y` - Output vector
- `w` - Weight vector

## History

- Neural networks, deep learning have been around for decades
  - Why now? 
    - More data
    - More compute + massively parallelizeable algorithms
    - Better algorithms
- Attention timeline
  - Transformers is an attention mechanism
  - RNN, LSTMs, simple attention mechanisms were used before
- RNNs
  - These can encode history
  - They cannot work with long sequences or context
- LSTMs are dead -- (long-short term memory) a type of RNN
- Historically features are hand-picked by humans
  - In deep-learning, features are learned and discovered by the model

## Overview

- What is missing from transformaers?
  - External memory
  - Computation complexity reduction
  - Alignment of models with human intent

## How Neural Networks Work

### Perceptron

- A perceptron is a single neuron in a neural network and is the most fundamental building block
  - Forward propagation
    - It takes *m* different inputs, multiplies each input by a weight and sums them together
      - It then adds a *bias* term to the sum to shift the function 
    - It takes the output of the sum and applies a non-liner activation function to it and that creates the output
      - One popular activation function is the sigmoid function...it's essentially a continuous version of a step function that outputs between 0 and 1
    - So 3 steps to get output (forward propagation of information through a perception)
      - Multiply inputs by weights
      - Sum the weighted inputs and add a bias
      - Apply activation function 
- Why non-linear activation functions?
  - These introduce non-lenearity into the model
- To have a multi-output perceptron, you'll just have two perceptrons

#### Representing Multiple Perceptrons

- Weights are stored as a vector
- Biases are stored as a vector
- This defines a single layer of a neural network
- To have a multi-layer neural network, you can make the outputs of the first layer the inputs of the second layer
  - This is called a *feed-forward* neural network
  - The output of the first layer is called the *hidden layer*
- The dimensions of each layer do not need to be the same
  - **This is a way to encode (or transform) input from one dimension to another**

### Training a Neural Network

- To train a model, you have to tell a model how far off the prediction is from the true prediction
  - This is defined as the *loss* of the model
- The *loss function* is a continuous function that is used to calculate the loss (cost function)
  - Loss functions look over the entire dataset and calculate the loss for each data point
  - The loss function is the function that is used to minimize the error between the actual and predicted outcomes
    - You want to minimize the loss on average across the entire dataset
- The goal is to find the weights that achieve the lowest loss on average 
- **A loss function is just a function of the set of weights**
  - Conceptually, you can plot the total loss for each set of weights
  - You can then choose some optimization algorithm to find the set of weights that minimizes the loss function
    - Gradient descent is one such algorithm
- **How do you compute the gradient line?**
  - Backpropagation
- Training is done by computing the gradient descent and multiplying it by a learning rate (i.e. how big of a step in the direction of the gradient do you want to take)
  - The learning rate is a hyperparameter that you can tune
  - Setting the learning rate is important because if you set it too high, you can overshoot the minimum and if you set it too low, it will take a long time to converge
- How do you set the learning rates?
  1. Try out a bunch of learning rates and see what works best
  2. Design an adapt learning rate that "adapts" to the landscape
- A gradient (over the whole dataset) is very expensive to compute for a large neural network 
  - Instead, you can ping a single point on your dataset and compute the gradient at that point
    - This is called stochastic gradient descent because it is a random point on the dataset (it's noisy but easy to compute)
  - You can compute a "mini-batch" of points on the dataset and compute the gradient at that point
    - 10s or 100s of examples in your dataset
    - This is called mini-batch gradient descent and is a happy medium between stochastic and full gradient descent
    - **This is the most common way to train neural networks**
- More accurate gradient calculations lead to smoother convergence and a larger learning rate (since we can trust the gradient more)
  - **This is parallelizable because you can split up a bunch of batches**
- Overfitting 
  - When a model is too complex and it starts to memorize the training data
  - You want to build models that generalize well to new datav and don't just mimic test data
  - To address this problem you can introduce *regularization* to penalize the model for being too complex
    - Regularization 1: Dropout -- randomly set some activations to 0 on some iterations of the training
      - This forces the model to not rely on any one node, and instead rely on the entire network and have multiple pathways
    - Regularization 2: Early stopping
      - Stop training before we have a chance to overfit
      - Set some of the training data aside and use it as a validation set and use it to monitor how well the network is doing on non-training data
      - When the loss decreases but the test loss increases on the validation set, you stop training  


#### Loss Functions

- Cross entropy -- a loss function for predicting binary output
- Mean squared error -- a loss function for predicting continuous output (e.g. grade in a class)
- The loss function of deep neural networks is non-convex
  - This means that there are multiple local minima
  - This means that you can get stuck in a local minima and not find the global minima
  - This is why you need to use a good optimization algorithm

#### Backpropagation

- Key question: **How does a small change in one weight affect the loss function?**
  - You can use the chain rule to compute the gradient of the loss function with respect to each weight
  - Each layer going backwards is another application of the chain rule
    - **This is why it is called backpropagation, because you are propagating the gradient backwards from the output**


## Attention Mechanisms

- What is an attention mechanism?
  - Attention mechanisms are a way to allow the model to selectively focus on the most important parts of the input
  - Attention is not just used for text -- it's used for images too
- Basic attention (hard/soft mechanism)
    - Soft attention 

## Use Cases

- Deepfakes
- Generating a simulated environment and training things like cars/planes in a simulator