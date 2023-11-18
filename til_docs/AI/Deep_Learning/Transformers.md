## Sequential Modeling

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

- 

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
- One way to do this is to use a one-hot encoding
  - This is a vector of length `n` where `n` is the number of words in the vocabulary
  - Each word is represented by a vector of length `n` where all values are 0 except for the index of the word in the vocabulary
  - This is a sparse representation of the input
  - No semantic information is encoded in this representation
- Alternatively, you can learn a neural network to learn the embedding to map related words to similar vectors
  - This is called an *embedding model*
  - This is a dense representation of the input
  - Semantic information is encoded in this representation
