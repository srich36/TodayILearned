# Terminology

- *Attention* - The foundational mechanism of the transformer architecture
  - Attention is a way to identify and pay attention to what is important in a potentially sequential stream
- *Self-Attention* - Attending to the most important parts of an input
- *Self-Attention Head* - A single unit of attention mechanism (positional encoding, query, key, value, attention, output)
  - Multiple attention heads are combined to extract different features

# Overview

- Transformers were created as a way to improve the performance of RNNs
  - First read the [RNNs](../RNNs.md) page for more information
- The goal of transformers is to remove LLN bottlenecks
  - Process information continuously as a stream of information
  - Parallelize the computation of the model
  - Establish long memory dependencies
- Language models, AlphaFold2, Vision Models, etc. all use transformers

## How Transformers Work

- What if we could eliminate the need to process information timestamp by timestamp?
  - This would remove the need to process information sequentially
  - This would remove the need to backpropagate through time
- Naive approach: What if we squashed the entire sequence into a single vector?
  - Now, we can build a feed-forward network 
  - Downsides
    - Does not scale (the network would need to be huge)
    - No order/temporal dependence, no long memory
- The key idea is to identify and *attend* to what is important in a potentially sequential stream

## Attention

- Attention at its core is intuitive
- Lets use an image as an example
  - We can identify the most important parts of an image by looking at it
  - We can then use this information to make a decision
- Goal:
  - Eliminate recurrence and attend to important information
- Steps
  1. Identify which parts to attend to -- this is the hard problem! It's similar to a search problem
  2. Extract the features with high attention
- Attention with search
  - Have some query (Q) and a set of keys (K)
  - How similar is the query to each key?
  - Now that we've identified the most similar keys, we can extract the values (V) associated with those keys
    - (e.g. if this were a video search on Youtube, the keys would be the videos name and the values would be the video itself)
- Using this in language:
  1. Encode position information
    - A neural network layer is used to encode positional relationships between words (this could be an embedding model)
  2. Extract query, key, value for search
     - A neural network layer is used to extract the query 
     - Another layer is used to extract the key
     - Another layer is used to extract the value
     - These layers do not feed into each other but are computed independenlty 
  3. Compute attention -- compute similarity score between each query and key
     - This is just a dot product of vectors -- cosine similarity
     - This operation gives us a score of how components of the input data are related to each other 
     (imagine a 2D grid of the sentence with each block being a word with each box having the similarity metric)
     - Each operation goes through a softmax function to normalize the scores between 0 and 1
  4. Extract the values associated with the highest attention scores by using the attention weighting matrix multiplied by the value
- This entire scheme defines one *self-attention head*
  - Multiple heads can be used to extract different features and then can be used to form a larger neural network architecture