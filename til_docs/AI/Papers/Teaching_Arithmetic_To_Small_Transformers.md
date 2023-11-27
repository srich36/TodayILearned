# Overview

- [Paper link](https://arxiv.org/pdf/2307.03381.pdf)
- Large language models like GPT-4 exhibit emergent basic arithmetic capabilities even though this isn't encoded
in the next token prediction objective
- How can we design a smaller transformer model to learn these capabilities using the next token prediction objective?
- This paper is designed to evaluate *how* these models learn those arithmetic capabilities
- This paper focuses on addition
  - It does explore other operators. When doing so, it samples from the training data to use a mix of examples
  so multiple operators are covered

**My Thoughts**
- Most of this work is irrelevant because the model isn't actually *learning* addition
  - It needs to see examples of the types (e.g. number of digits) of addition beforehand to be able to respond correctly
- Because this does not generalize across operand lengths (i.e. the number of digits of the two numbers for addition),
this is not suitable for actually having these models understand arithmetic (and there will still be errors unless it has seen a 
large number of examples for the given operand lengths!)
- New architectures/training objectives are required to truly teach models arithmetic 
  - This could be a very small improvement to existing language models (particularly smaller models) but I doubt it

## Conclusions

- Conventional training data is not the most effective for arithmetic learning
- Simple formatting changes can improve accuracy 
  - Reversing the order of the result significant digits helps
    - This is likely because the next token prediction task likely isn't optimized for outputting the most significiant digit first
    - This only works if you're training a model from scratch -- you don't want to fine-tune a model with different format than it was pre-trained on
  - Varying the different "types" of addition (e.g. # of digits, whether the number is carried, etc.) helps
  - Share phase transitions from 0-100% accuracy is seen as a function of the size of the training data
  - The most effective format was a "detailed scratchpad" with step by step instructions and details on how the task was performed
- Train on chain-of-thought style data
- Going from zero-shot to one-shot prompting significantly increases accuracy, but accuracy isn't gained by increasing 
the number of examples
- Do the models *truly* understand arithmetic?
  - Generalizing beyond trained digit lengths is difficult
      - This shows the models likely learn arithmetic not from an algorithm, but as a mapping function constrained to trained digit lengths
  - So, based on a reasonable definition, **no**

### Why the Phase Transition to 100% Accuracy?

- Connection to Low-Rank Matrix Completion
  - Learning an addition map on `n` digits from random samples can be considered as completing a rank-2 matrix
  - This is an `n x n` matrix `M` where the (i, j) entry represents the output of the addition `i + j`
    - `n` here is the max number that can be added (e.g. `100` for 100 for 2 digits, including 0)
  - The model doesn't need to see the whole matrix of examples and can learn to fill in the gaps
  - Excluding an entire digit from a dataset (e.g. `5`) rather than just some numbers up to `n` makes the model perform worse
    - This demonstrates the model isn't generalizing across digits
  - Because the model does not need a full matrix to be completed for accuracy, the algorithm it's learning is not just low rank matrix completion

### Extending to Longer Digit Addition

- The conclusions from above are even more pronounced in larger digit arithmetic 
- If a model has learned `k` digit arithmetic, you need a relatively constant number of examples to learn `k+1` digit arithmetic
- The model may forget some of it's lower digit arithmetic when fine-tuning it to learn higher-digit arithmetic