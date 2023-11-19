## Sequential Modeling

- **The main question to ask when designing a neural network is: What is the input and what is the output?**
  - Is data sequential? If so, then we need to use a sequential model (RNNs)
- Sequence modeling: How we can build models that learn from sequences of data
- What is sequential modeling?
  - Predicting where a ball will travel next -- you need to know the previous position of the ball
  - Predicting the next word in a sentence -- you need to know the previous words in the sentence
  - Audio recognition, etc.
  - Sentiment classification
- Traditional binary classification (e.g. will I pass my class) does not require sequential modeling and can 
be modeled with a simple feed-forward neural network

## Neurons with Recurrence

- Even if we stack layers together in a feed-forward neural network we still don't have sequential modeling
  - We can think of this as evaluating **inputs at a certain time**
- What if we ran this operation multiple times for each timestep?
  - They would be independent copies of each other with different inputs at different timestamps
  - But what if an output at a certain timestamp depended on the output of the previous timestamp?
- **What if we linked something that is being computed at a given timestamp to the computations at a later timestamp?**
  - This is making each timestamp computation stateful, and we call this internal state `h` (a memory term)
  - The output of a model is thus a function of the individual inputs **and** the past state
- So, for each execution timestamp the state `h` updated and fed back into the neurons in a recurrence relation
  - This ensures that the state `h` is updated as time progresses
- State doesn't just belong to the model, it belongs to individual neurons
- The cell state is the memory of the neuron, and is calculated as a function of the weights, inputs, and previous state
- Computing the state at a given timestamp is done by:
  - Multiplying a set of state weights and multiplying them by the previous state
  - Multiplying a set of input weights and multiplying them by the input
  - Adding the two together
  - Applying a non-linear activation function to the result
  - **Note that the weight matrices for state updates are different than the weight matrices for input updates**
- To generate an output at the given timestamp, we can use another weight matrix to multiply the state 
- Thus, there are three main weight matrices in a recurrent neural network:
  - State update weights (state -> state, `W_hh`)
  - Input weights (input -> state, `W_xh`)
  - Output weights (state -> output, `W_hy`)
- Another way to picture RNNs (or compute RNNs) is to iteratively process the input sequence over time and passing the state from one timestamp to the next
  - This is called *unrolling* the RNN
  - This is a way to visualize the recurrence relation
- The same weight matrices are used at each timestamp
- RNNs can take a single input and produce many outputs, (one-to-many)
  - For example, a single image can be used to generate a caption
- RNNs can also take many inputs and produce a single output (many-to-one)
  - For example, a sequence of words can be used to predict the sentiment of a sentence
- RNNs can also take many inputs and produce many outputs (many-to-many)
  - For example, a sequence of words can be used to generate a sequence of words

### Training RNNs

- Defining loss
  - A prediction at an individual timestamp gives a computed loss at that timestamp
  - We can sum the loss across all timestamps to get the total loss
  - **This defines the total loss to one input in an RNN**

#### Backpropagation Through Time

- This is the training algorithm for RNNs since information is time-dependent
- Backpropgation through time needs to:
  - Backpropagate the loss through each timestamp: e.g. the last timestamp, then the second to last timestamp, then the third to last timestamp, etc.
    - This is **computationally expensive** as the gradient explodes because of the number of calculations
  - Vanishing gradient: The gradient approaches 0 as you backpropagate through time. This is a very real problem since there are
  so many multiplications of small number -- without a gradient you don't know how to optimize 
- Intuition:
  - Use a sentence as an example ("The clouds are in the __")
    - If the related information ("clouds") are close together in the sentence, then the gradient will be large (because it hasn't had time to diminish) and work
  - Another sentence (e.g. "I grew up in France...I speak fluent __")
    - The related information ("France") is far away from the blank, so the gradient will be small as you backpropagate and then the gradient for "France" will be multiplied
    by a very small number so it won't really matter
    - **This is the problem of long-term dependencies**
- How to alleviate the long-term dependency problems:
  1. Activation Functions. use the ReLU activation function instead of the sigmoid function (values are oftern 1 not 0)
  2. Parameter Initialization -- initialize the weights to an identity matrix and set bias to 0
  3. Gated Cells. The most complicated but most effective solution. These are called LSTMs and GRUs
     - Selectively control what flows into the neuron to control what is used for the computation. This can be used to filter out what isn't important and
     keep the most relevant information
- LSTM (Long short term memory) network
  - This is a type of RNNs that uses gated cells
  - They maintain a cell state that use gates to control the flow of information to update the network
  - LSTSMs can
    - forget -- forget irrelevant information
    - store -- store relevant information from the current input
    - update -- update the internal state

### Sequence Modeling Design Goals

- Models should
  - Handle variable-length sequences
  - Be trained to track and identify dependencies between inputs at different time steps
  - Maintain information about order
  - Share parameters across different parts of the sequence (weights should be the same across different parts of the sequence/timestamps)
  - Handle differences in order of the sequence (e.g. the food was good, not bad vs. the food was bad, not good)
- RNNs do meet these design criteria

### Using RNNs

- You first have to convert your input data in a way that the neural network to understand
  - Neural networks are just mathematical functions -- they only understand numbers
  - Thus, we have to convert language into numbers
  - This is done by tokenizing the input with an embedding model
    - **Embedding models compress information -- they convert arbitrary length inputs into fixed-length vectors**
- One way to do this is to use a one-hot encoding
  - This is a vector of length `n` where `n` is the number of words in the vocabulary
  - Each word is represented by a vector of length `n` where all values are 0 except for the index of the word in the vocabulary
  - This is a sparse representation of the input
  - No semantic information is encoded in this representation
- Alternatively, you can learn a neural network to learn the embedding to map related words to similar vectors
  - This is called an *embedding model*
  - This is a dense representation of the input
  - Semantic information is encoded in this representation

## Limitations of RNNs

- Encoding bottleneck -- information needs to be input sequentially
  - This is a problem for long sequences
- By doing timestamp by timestamp RNNs, are slow with no parallelization
- **When you process data step-by-step the model does not have long-memory**
  - Imagine there are 10k tokens -- the 10kth token will have no information about the first tokengt