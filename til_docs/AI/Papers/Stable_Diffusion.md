# Overview 

- Image models are very computationally expensive 
- Training these often takes 100s of GPU days
- Evaluating a model is also expensive in time and memory
- The key to this paper was to reduce computational demands while maintaining performance of diffusion models

## Training

- Training is broadly categorized into two stages
  - Perceptual Compression - removes high frequency details but still learns some semantic variation 
  - Semantic Compression - The model learns the semantic composition of the data