# Overview

- LMQL is a model query language to enforce the model to produce certain ouptuts that adhere to certain constraints 
    - Practical implementations of these constraints require model-level understanding of the decoding procedures, tokenization, and vocabulary of the LLM
- When relying on language model programming with constraints (LMQL) you can restrict the search space of the decoding process and make inference cheaper and faster
- LMQL allows you to define variables in your prompt that the LLM can fill
    - e.g. the LLM first responding with the name of a person
    - the LLM then writing text in the style of the user
    - This would normally entail chained prompts but can be expressed in one prompt using LMQL -- the LMQL engine does the heavy lifting behind the scenes for you
- LMLQ constraints are enforced by token level inference masks and partial evaluation semantics
    - Basically, LMQL provides a mask of allowed tokens at inference to enforce constraints 
- **LMQL requires that it can access the distribution of vocabulary tokens**
    - This is the core interface of most language models so they can be integrated pretty easily
    - The huggingface transformers [`generate`](https://huggingface.co/docs/transformers/v4.34.1/en/main_classes/text_generation#transformers.GenerationMixin.generate) function works with these parameters and thus all huggingface models are supported
    - This provides a lower-level interface to working with language models rather than working directly with text completions

## LMQL Language

- Each query is written in a Python function, where each top level string is a direct LLM query
    - You must specify the model to use and the decoding algorithm used to generate tokens
- The LLM runtime will split the Python function up into all of the top level strings, call LLMs to fill any variables, then fill the variables for downstream
consumption in other calls or the output
- For each new token LMQL computes a *mask* over the token vocabulary (which tokens are allowed) and uses this mask when selecting a token from the token distribution 

## Validation and Constraint Decoding

- LMQL created an execution model that efficiently finds decoding masks at each step of the execution 
- Naive approach
    - Generate a sequence, check if it matches constraint validation 
    - If this fails, you'd need to backtrack and try again with a new set of tokens 
    - This is very computationally (and cost) expensive 
- Instead, LMQL created an eager partial evaluation engine that can model if a current sequence can be guaranteed to never hold (pass validation) for any continuation of the current sequence
- 