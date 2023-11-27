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
- *LSTMs* - Long short-term memory -- a type of RNN that uses gated cells to remember relevant information and forget irrelevant information
over time
  - These are designed so long-term dependencies can be tracked and backpropagation through time can be done without vanishing gradients
- *Fully Connected Neural Network* - A neural network where each neuron in a hidden layer is connected to every neuron in the next layer
- *Dense Layer* - A layer where each neuron receives input from every neuron in the previous layer
- *Optimizer* - An algorithm that is used to update the weights of the neural network
  - Examples: gradient descent, stochastic gradient descent, etc. Different optimization algorithms often use gradient
  descent as a backbone but not always
- *Residual Neural Network* - A neural network that uses skip connections to jump over layers
- *Autoregressive* - Autoregressive models take in historical state data as input to predict future state
  - This is different than models that just take in a set of defined feature inputs
  - Many stock market models are autoregressive
  - ChatGPT is autoregressive because the next token in a sequence generation depends on the previous tokens
    - The output from one iteration is used as the input into the next
- *LoRA*  - Low-Rank Adaptation of Large Language Models
  - A training method that accelerates the training of large models while consuming less memory
  - This essentially freezes the pre-trained weights and injects trainable parameters into each layer of the architecture
  - **This is critical**, since redeploying new weights for each 70B+ parameter model fine-tuned is not feasibleggk
- *Emergent abilities* - Functions that the model develops that aren't explicitly in the model's training objective
- *Policy Learning* - A reinforcement learning technique where the agent learns to optimize the decision making policy *directly* 
without ever having to learn the `Q` function
- *Direct Preference Optimization (DPO)* - A new approach for aligning models in finetuning with human preference as an alternative to RLHF

## Hyperparameters

- *Batch Size* - The number of training examples used before the model's parameters are updated
  - This determines how many examples are presented to the model at once
  - **It has no bearing on the actual model architecture -- after training you can update this to 1 and it will still work**

### Mathemtical Terms

- `x` - Input vector
- `y` - Output vector
- `w` - Weight vector

## Key Concepts

- *Universal Approximation Theorem* - A neural network with a single hidden layer can approximate any *continuous* function
  - **Neural networks are just really good function approximators**


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

## General Notes

- Models may have a different layer structure at test and inference time
  - e.g., we may add dropout layers at training time to prevent overfitting, and remove them at inference time
  - The weights for the actual model are the same though
- Often the output/expected result of your training data are called *labels*
  - e.g. For a binary classifier (e.g. spam/not spam), the labels would be 0 or 1
- *Universal Approximation Theorem* - A neural network with a single hidden layer can approximate any *continuous* function
  - This is why neural networks are so powerful
  - However, there are a few caveats
    - The number of neurons in the hidden layer may be very large
    - The resulting model may be very complex and may not generalize beyond that function
- A pretty standard neural network architecture that has a vision component is
  - Convolutional layer to extract features from image inputs
  - Fully connected layer to classify the features and make a decision
- The most standard benchmark for image classification is the *ImageNet* dataset

## Limitations of Deep Learning Models

- Modern deep networks can perfectly fit to *random data*
  - This means that models don't necessarily generalize well beyond the training data
    - The network is just generating a function that fits the training data -- there is no guarantee that the function
    structure beyond the training data is meaningful
    - It could be a *crazy* function that over the training data just happens to fit
- The network is only as good as the training data it is given
- Algorithmic bias
- Computationally expensive...
- **These are problems in research we can solve**
- Difficult to **encode structure** and prior human knowledge during models

### Neural Network Failure Modes

- Mismatches between training data and real-world data 
  - How do models behave when they encounter information they are uncertain about?
- Small random noise to input data (e.g. images) greatly affect the output of the model
  - Humans are robust to this, but the models may classify the image as something completely different
  - This is an *adversarial attack* -- how can we modify input data to increase the loss?

### Misc Notes (Old)

- Alignment vs. capability is similar to accuracy vs. precision [link](https://www.assemblyai.com/blog/how-chatgpt-actually-works/)
  - *Capability* - How well a model can maximize its objective function (e.g. a model designed to maximize stock market predictions)
  - *Alignment* - How well can the model do what we **want** it to do vs. what it was trained to do
  - For example, a model designed to predict bird types may maximize its objective function extremely well, but that objective function may
    not actually be great at making predictions
  - Models like the original GPT-3 are misaligned -- they can produce large amounts of text but not be consistent with human intent
    - These models' objective function is a probability distribution around tokens (capability) but they are expected to perform cognitive reasoning (alignment)
  - ChatGPT was trained with human feedback to help align the model better to its output (RLHF)
    - ChatGPT was the first model to put RLHF into production
  - Alignment also includes producing non-toxic and unbiased responses
- Supervised fine tuning (SFT) is a technique to train a model that involves fine-tuning the model on a set of high-quality, pre-labeled output data by humans
  - This is the standard fine tuning process
  - The huggingface `transformers` library is the most popular way to fine-tune models
- Distilled supervised fine tuning (dSFT) is a technique to train a model on a smaller dataset by using a larger model as a teacher
  - The teacher model is used to generate labels for the smaller dataset
  - The smaller dataset is then used to train the smaller model
  - This is a form of transfer learning, **but the student model does not ever reach the performance of the parent model** and are not aligned
  - In general, training on human feedback > dSFT
- One *epoch* in model training is when all the training data is used once
  - This gives each piece of training data an ability to update the model parameters
- One limitation of this study is that GPT-4 was used as the evaluator for the benchmarks and
  it's known to be biased towards models derived from itself
- *Loss function* - A loss function is the mathematical function that is used to minimize the
  error between the actual and predicted outcomes
