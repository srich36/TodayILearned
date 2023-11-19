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