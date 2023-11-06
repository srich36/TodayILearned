# Overview

- Goal was to make a smaller language model that is aligned to user intent
- Models recently have seen increased performance by training on more tokens than the original Chincilla scaling laws
and have been further trained using distilled supervision fine-tuning (dSFT) from parent models
- This paper uses AIF (AI Feedback) with a set of teacher models to create an aligned version of Mistral-7B
  - AI feedback has teacher models evaluate and score the outputs of various models which are then used to create a dataset for training
  - GPT-4 ranked the models in this case
- Distilled direct preference optimization was a key last step in achieving this performance
  - In this, the best response and a random response to a prompt are sampled and direct preference optimization is applied to try and get the model to
  generate the best responses
- Results from this paper shows the 7B model performs comparatively to a 70B chat model aligned with human feedback
- Fine-tuning was done on 16 A100s and took 2-4 hours to complete
- The UltraChat and UltraFeedback datasets were used to train the model
- Zephyr sets a new benchmark for open-source models but still fall behinds the best proprietary models
  - It also does not do well on complex tasks like math or coding