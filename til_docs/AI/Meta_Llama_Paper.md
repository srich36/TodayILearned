# LLama Models

- The goal was to find a model that could be run on a single gpu - reduce model compute required at inference time]
    - This is related to the number of parameters in a model
    - Models *do* get better as you train them with more parameters, but they also get better as you train them on more
    tokens at the same parameter count
- The Llama models range from 7B parameters to 65B
- For reference, training the 65B parameter model used 1.4 trillion tokens and took 21 days in a very efficient training process
- After training the models they actually thoroughly outperformed GPT-3