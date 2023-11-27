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
- *Masked Decoding* - A particular case of decoding is if we can already rule out certain tokens at certain positions 
    - We can ignore those tokens and perform decoding over the remaining sets (e.g. when instructing a model to respond with only "positive" or "negative")
- What is an LLM?
  - An LLM is just two files:
    - A parameter file (the weights of the neural network)
      - Every parameter is stored as 2 bytes since it's a float16
        - Thus a 70B parameter file is actually 140B on disk
    - An inference file (on the order of magnitude of 500 lines)
- A 70B parameter model runs about 10x slower than a 7B parameter model as a sense of scale
- Neural networks are just trying to predict the next token in a sequence
- Next word prediction as an objective forces the network to learn a lot about the world inside the parameters of the network
  - All this knowledge is compressed into the parameters
- To predict a whole sequence, you get a prediction, feed it back into the model, get a prediction, feed it back into the model, etc.
- **The model will output text in the form of "internet documents"** (a representation of how text is written on the internet)
  - This is the first form of training -- *pretraining*
- We don't fully understand how the parameters of the model encode the knowledge of the world and make the network effective
at next word prediction 
  - A field (mechanistic interpretability) is trying to understand this

### Training

- **LLMs are essentially compressing the English language into a set of parameters**
  - A parameter file is the compressed representation of the text
  - This is about a 100x compression ratio
- Llama2 was trained on roughly 10TB of text crawled from the internet
- *Pretraining* - The first step of training an LLM to get it to do next-word prediction effectively
- Training an assistant model is the second form of training -- *fine-tuning*
  - The models are then fine-tuned on a different type of dataset, one that is conversational
  - Typically companies will hire people and give them labeling instructions and ask people to come up with
  questions and write answers to them
  - In this second stage we prefer **quality of quantity**
  - Probably have about 100k documents
- Once you have fine-tuned the model you now have what's called an *assistant model*
  - The model now knows it should answer in the style of a helpful assistant
- **Models can change their format in how they answer to be an assistant, but can still access all the knowledge from the
first training stage**
  - Pretraining: Knowledge
  - Fine-tuning: Alignment
- Since fine-tuning isn't computationally expensive, you can keep fine-tuning the model in an iterative process to fix
issues
- *Stage 3 Fine-tuning (RLHF)* - An optional fine-tuning stage with comparison labels
  - It is often much easier to compare Answers instead of writing answers
  - Labelers can just pick the better of the two answers
  - These can be used to fine-tune the model even further
  - This is the RLHF (reinforcement learning from human feedback) component of these models
  - See [Reinforcement Learning](./Reinforcement_Learning.md) for more details
- An alternative to RLHF is [DPO](#direct-preference-optimization-dpo)
- Labeling these days is becoming more and more automated

### LLM Scaling Laws

- Performance of these models is actually remarkably smooth and only a function of two variables:
  - `n` - Number of parameters
  - `d` - Amount of data we train on
  - See [Statistics](../Deep_Learning/Statistics.md) for more information on what the parameter size should be
  - **These trends do not show signs of topping out** (with regards to next word prediction accuracy)

### Tools

- You can augment the Language Models with tools (e.g. web browser, function calling) to give the model more capabilities
  - The model has a way of outputting special tokens that can be used to trigger these tools
- This can help the model generate graphs, use calculators, etc.
  - This is great for analysis

### LLM Security 

- Jailbreak -- you can get around restrictions by using things like roleplay to get the model to say things it shouldn't
  - There are lots of different types of jailbreak attacks
  - You can base64 encode your query to get around the model
- When the LLM is trained for safety, most of the safety data is in English
  - The model then learns to avoid harmful queries in English
  - Thus, there are lots of ways to get around this
- *Universal Transferable Suffix* - A paper came out that gave a single suffix of words that you could add to any prompt to 
jailbreak the model
  - This is super cool
  - The researchers claim they can just generate a new sequence if they needed so you can't just block it
- Certain images can contain noise data that will jailbreak the model
- Prompt Injection
  - Can inject a super small prompt into an image, webpage, etc. to give the model a new prompt
- Data poisoning / backdoor attack
  - Attacker hides a carefully crafted text with a custom trigger phrase
  - If a model is trained on that text, that trigger phrase can trick the model into responding in any way
  the attacker wants
    - This was only demonstrated in fine-tuning, not pre-training

### Looking Towards the Future

- System 1 vs. System 2 thinking
  - System 1 is fast, automatic, and unconscious
  - System 2 is slow, effortful, and conscious
- LLMs currently only have system 1 thinking
  - Intuitively, we want to convert time into accuracy
  - Give a language model 30 mins and allow them to "think" and then give an answer
- Self-improvement
  - In AlphaGo there was two steps:
    - Learn from expert humans
    - Learn from self-play
  - AlphaGo Zero skipped the first step and just learned from self-play (and is better than AlphaGo)
  - This has a really easy reward function (win or lose)
- For LLMs today we're only doing the first step (imitating humans)
  - The reward function is much more complicated for LLMs
  - In more narrow domains, the reward function could be easier
- LLM OS
  - The LLM can potentially be thought of as the kernel process of an operating system
  - This is Karpathy's take

## Miscellaneous notes

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
- LLM leaderboards can be created with an "Elo" rating, where you play language models against each other and a human picks the better answer

## Direct Preference Optimization (DPO)

- 