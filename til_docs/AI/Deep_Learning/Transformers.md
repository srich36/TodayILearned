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
- The native representation a transformer operates on are sets
  - This is just a set of nodes directionally connected to one another
  - If you can model your problem in this way you can use transformers


## Background

### Why Transformers

- What if we could eliminate the need to process information timestamp by timestamp?
  - This would remove the need to process information sequentially
  - This would remove the need to backpropagate through time
- Naive approach: What if we squashed the entire sequence into a single vector?
  - Now, we can build a feed-forward network 
  - Downsides
    - Does not scale (the network would need to be huge)
    - No order/temporal dependence, no long memory
- The key idea is to identify and *attend* to what is important in a potentially sequential stream
- The transformers architecture can be mostly used across basically all areas of ML

## Attention


### Types of Attention

Using images as an example here

- *Soft Attentions*
  - Learn attention weight in [0,1] over image patches
  - This is computationally expensive
- *Hard Attention*
  - Learn attention weights in [0,1] over image patches
  - This is non differentiable
- *Global attention*
  - Similar to a soft attention mechanism
- *Local attention*
  - Combines local hard attention with global soft attention
  - Hard attention is only computed over a small set of the input
- *Self-attention*
  - Each node produces a key, query, and a value from an individual node
- *Cross-attention*
  - Queries are produced by individual nodes, but keys and values are produced by nodes coming from an encoder or external source, etc.
    - *The keys and values to answer the query can come from another source*
    - In cross-attention attention can also come from other decoder nodes as well

### Self-Attention

- This is the basis of *Attention is all you need*

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
    - **This is similar to how CNNs can have different convolutoions for different features**
    - E.g one head for part of speech, one for syntactic structure, etc.
- Self-attention is an unordered function of its inputs
  - Every word is attending to every other word
- Masking
  - This is what allows us to parallelize operations while not looking at the future
  - Keeps information about the future from "leaking" into the past
  - This is used in the decoder
- **Self-attention takes quadratic time and space**
  - Each token attends to all other tokens

### Understanding Q, K, V

- The input to a transformer model is a sequence of tokens
- Each "head" in attention generates its own set of key, query, and value vectors for all tokens
  - This conversion is a learned representation of weights
- The way to think about this, from the perspective of a single head
  - In a decoder with sequence length `n``, each head computes `n` Q, K, and V for each node of the input (the # of nodes = the # of input tokens)
  - Tokens from future timesteps are masked out
  - Attention is then used to generate the output for this head of attention -- it is looking for a specific feature
  - This is happening simulatneously for a bunch of different heads
- In a model with a 200k context window, **each separate attention head would compute 200k Q, K, and V vectors** for use


### Encoder-Decoder Architecture

- Similar to LSTMs, transformers follow an encoder-decoder architecture
  - This means that first the input gets read in
  - The input is then encoded
  - The decoder is then the part of the network that generates the output tokens
- **Encoder block**
  - A self-attention layer followed by a feedforward layer
    - Self-attention is only linear, so the feedforward provides non-linearitj
  - Each of these is f
- **Decoder block**
  - Each decoder is similar to the encoder blocks except it also has a multi-head attention block on the outptu of the encoders
  - Masking is used to prevent positions looking ahead during self-attention
- Modern language models only contain the decoder blocks of transformers
- **The only difference between an encoder-decoder block is that decoders have future token masking while encoders do not**
- Encoder-only models like BERT get the full context of the sentence and thus can be used for tasks like sentiment classification, etc.


#### Karpathy Intro to Transformers

- Attention is all you need
  - A full package model, delete all RNN components
  - Positional encodings
  - Multiple heads of attention in parallel
  - A new set of hyperparameters to use
  - This was a bunch of new things at the samet ime
- Since there is no concept of space in attention, **you need to positionally encode your inputs**
- What makes transformers so effective?
  - They are few-shot learners

##### Karpathy's understanding of attention

- In this paradigm, each node is a token
  - e.g. representing the third word of the output in the decoder
  - This isn't a perfect representation 
- Understanding attention (Karpathy's understanding)
  - This is the communication phase of the transformation
    - Message passing on directed graphs
      The DAG is essentially the input node -> output node
    - **In this DAG, in the encoder part of a transformer it's fully connected, whereas in the decoder only the tokens from the past are connected**
  - There is also a compute phase
  - Each node stores a vector
- Each node has a set of data
  - A query (what am I looking for)
  - A key (what do I have)
  - A value (what am I communicating)
- Each node will have a different query
  - The node pulls data (the keys) from all it's connections, takes and takes a dot product of those keys with its values
  - You then do a weighted sum of the values to get your update
    - This updates the node
  - Each node is updated individually 
  - This is just vectorized and done in batches, but can be thought of as node-by-know
- **This happens in every node in parallel, and every layer in series**
- In a decoder, we don't connect future tokens as part of the attention process, which is why we can think of this attention mechanism of a DAG where edges are missing for future tokens
- NanoGPT (Karpathy wrote) is a GPT-2 levelmodel that is easy to read and learn from

#### More Karpathy Transformer Notes

- Batch size is how many sequences in parallel to process
  - The higher we can get this the more we can take advantage of the GPU
- `block_size` is the size of the context the model can be trained on
- When training an LLM in a sequence you actually learn from every timestemp in the input
  - Since a 5 word sequence has 4 predictions to train on
  - So the training count is ~ batch size * sequence length
- The transformer takes the embeddings, adds a positional encoding to the sequence, adds them togther, and uses this as input
- After positional embedding summing with output embedding and doing optional dropout, the input feeds into a series of transformer blocks
- Then this undergoes a layer normalization and the log probabilities of the next token are output

##### Transformer Blocks (Encoder/Decoder blocks)

- A *block* (encoder or decoder block) is just a collection of layers grouped into one block
  - This contains the self-attention, feed-forward network, optional cross-attention, etc.
- In the *Attention is all you need* paper there are 6 encoder + decoder blocks
  - This means that there are 6 collections of these layers stacked sequentially on top of one another
  - Like in CNNs where earlier layers represent things like edges, shapes and later layers represent features
    - Earlier blocks in transformers represent token relations and deeper layers represent higher-level information present in the input
- The output of the attention layer in a transformer is a vector for each token
  - An input sequence with `n` tokens will have `n` vectors as output from the attention layer
  - The output is the same from the feed-forward part of the block so it can feed into the next block
- In the communicate phase, all the nodes get to talk to each other
  - These nodes are essentially neurons representing tokens
  - Nodes are only connected to nodes in the past
- Self-attention is done on all of the nodes and they receive their updates
- Then the compute phase happens which is just a multi-layer perceptron feed-forward network
  - This is a separate set of layers (2 layer neural network) in each node
- The outputs of this are then normalized + a softmax to get the output probabilities
- The self-attention (communication phase)
- The batch, head elements, timesteps, and features are all computed at once with one big matrix multiplication
- After this computation the attention is masked
- In the classic transformers archtitecture diagram, the "output embeddings" input to the decoder consits of the autoregressive tokens generated by subsequent outputs of the model

### Transformer Decoder Blocks Into a Word

- The decoder stack outputs a vector for each token in the sequence
- Somehow (I think it just looks at the last vector from the most recent token?) one `n` dimensional vector is fed into a linear layer to output logit probabilities of the vocabulary
  - These logits are of the same dimension of the token vocabulary
  - From [reading nano-GPT](https://github.com/karpathy/nanoGPT/blob/eba36e84649f3c6d840a93092cb779a260544d08/model.py#L190C1-L191C1) this looks correct
    - Theoretically you could recalcuate the logits again every time, but it's not needed for inference
- Copmuting logic is based on two steps
  - Scoring via the linear layer
  - A softmax layer then turns these scores into probabilities

### Visual Transformers (ViT)

- Transformers have been applied to all the other fields
- Take an image and chop it up into little squares and feed it into the transformer
  - Karpathy thinks this is kind of ridiculous 
  - All the patches are talking to each other

### Other Implementations

- Decision Transformers in RL
- Speech to text
- AlphaFold
- **A lot of things can use a transformer, as long as you chop it up into pieces and self-attend over everything**
  - The self-attention figures out how everything should communicate


### Future Needs

- External Memory
- Reducing compuation complexity
- Alignment with language models of human brain

