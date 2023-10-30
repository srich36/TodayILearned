# Miscellaneous notes

- Base models are models that are not yet fine-tuned to your specific use case
- Often as part of the model training process RLHF (reinforcement learning from human feedback) is used as a step 
    - InstructGPT from OpenAI is the seminal paper about how these models are trained 
- LLMs only produce one token at a time, so you will need to call them multiple times to get a full output
- In model calls (e.g. OpenAI APIs) you can specify penalities (or vice versa) for specific tokens to essentially ban them from the output
- **An LLM is just a model that predicts the distribution of the next token in a sequence**
    - Anything other than that is just stuff built on top of those LLMs to generate full text completion
- *Alignment* - A step in the model training process that attempts to get the model to produce desired results 
- The original transformer architecture has both an encoder and decoder block
    - Decoder-only transformer models only have the decoder block and accept input as a set of tokens 
    - Almost all chat models use decoder only architectures 


## How LLMs Work

- LLMs operate on tokens
    - Common words correspond to one token, whereas less common words take multiple tokens to tokenize
- Given an input sequence of words, a tokenizer maps the sequence of words to a sequence of tokens
    - A language model then predicts a score for ever possible next token
    - The score prediction function does not need to be a neural net by definition (though these are almost all variants of Transformers)
    - These scores are then converted into a probability distribution for the next token
- *Decoding* - Based on the probability distribution, a token is selected based on one ofa few algorithms
    - Greedy (highest probability) -- very rarely corresponds to the best overall sequence of all tokens
    - Sampling -- pull samples from the distribution. Often used when generating more than one output
    - Full Decoding -- enumerates all possible sequences until the end and picks the one with the highest probability
        - This is prohibitively expensive computationally (could some probablistic optimization like particle swarm help here?)
    - Beam search -- the middle ground between greedy and full decoding (n beams are maintained at each time instead of all combinations)
        - At the end, the top choice from the n beams is picked
        - For beam search and sampling, the *temperature* can be used to control the diversity of the output (higher temperature is more diverse output)
- The language model is continually invoked until a special stop sequence is encountered, thus meaning the full completion has occurred 
- *Mased Decoding* - A particular case of decoding is if we can already rule out certain tokens at certain positions 
    - We can ignore those tokens and perform decoding over the remaining sets (e.g. when instructing a model to respond with only "positive" or "negative")
