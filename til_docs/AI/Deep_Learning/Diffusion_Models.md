## Overview

- Goals
  - Stable when training
  - Efficient 
  - High quality 
  - Easy to generate new samples out of training data
- Diffusion models 
  - Text-to-image
  - Takes an embedding model that converts text to a vector and then uses a diffusion model to generate an image

## Diffusion Models

- In VAEs the task is to generate an image in *one-shot* from the latent space
  - Sample from the latent space and decode to get the output
- Rather than *one-shot* prediction, diffusion models use *iterative* prediction
    - Start from a random image and repeatedly refine it and reduce noise
- When we start from a completely random state, this allows us to generate new samples that are fresh
- Forward noising
  - Data-to-noise
  - Start with training data (e.g. example images)
  - Progressively add increasing amounts of noise to the data
    - This corrupts the data until it is pure noise
- **The neural network is trained to reverse this** (noise-to-data)
  - *Reverse Denoising* is the process of recovering the data from the noise

Forward Noising Steps
1. Given an image go to random noise
2. Progressively add more noise
   - Starting at the first timestamp T_0, progressively add more and more noise until you get to 100% noise 

Reverse Denoising Steps
1. Given an image, can we **learn** to estimate the image at T-1 (the previous timestamp)
   - This is the reverse denoising step
   - This is the reverse of the forward noising step
   - All the two steps differ by is the noise function
     - The noise applied is different at each timestamp determined by a variance schedule
- When building this models you define a set number of timesteps 
  - The more timesteps you have better resolution, but the more expensive it is to train

### Sampling New Instances

- To get a completely random sample, we can start with completely random noise 
- Each timestamp this sample gets slightly less noisy 
- Because there are lots of predictions we get a lot of stochasticity

### Beyond Images

- We can use diffusion models for molecular design
  - This can generate models in 3D
- Diffusion models can be used to generate proteins 
  - Can we design new proteins with new biological or therapeutic properties?

## Latent Diffusion Models

- Latent diffusion models operate on the *latent space representation* of an image rather than the raw pixels

The process is as follows:
1. Encode input into a latent space representation
2. Sample from the latent space representation 
3. Go through the diffusion process on this latent space representation to genearte a high-quality image

**Since we are operating on the latent space rather than raw pixels, any input (e.g. text) can be encoded
into the latent space for generation**
- This is how models like stable diffusion can generate text-to-image 
- Because the latent space is a Gaussian distribution because of the regularization loss term (see [Generative Modeling](./Generative_Modeling.md))
these still allow for random sampling from the latent space to generate images not dependent on input