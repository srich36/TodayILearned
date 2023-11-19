## Terminology

- *Supervised Learning* - A type of machine learning where the model is trained on labeled data and is designed to map an input to an output
- *Unsupervised Learning* - A type of machine learning where the model tries to learn the underlying structure or hidden structure of the data
- *Latent Variable* - A variable that is not directly observed but is inferred from other variables
  - They are the true underlying factors/features that influence the output of what we see

## Overview

- The goal of generative modeling: **Take a dataset and learn the underlying distribution (probability distribution) of the data**
  - This is a form of unsupervised learning
  - Take observed data and identify the latent variables that make up the data
- Density estimation
  - Given a dataset, generate a probablity distribution that describes the data
- Sample generation
  - Learn the model of the underlying probability distribution and generate new samples from that distribution
- Because generative models learn the probability distribution they can be used for outlier detection
  - Rare events can be used during training to improve even more
- Huge advancements in generative modeling don't use Autoencoders or GANs -- they are diffusion models
  - **GANs/Autoencoders are largely constrained to generating samples that are similar to the training data**
  - Diffusion models can generate samples that are not in the training data

## Autoencoders

- Autoencoders -- learn a lower-dimensional feature representation from unlabeled training data
  - Convert high-dimensional input data into a lower-dimensional feature representation vector for latent variables
- How do we learn the latent variable encoding?
  - The model tries to map the latent variable to the original input data
- So the pipeline is as follows:
  - Try to find a mapping from input data -> lower dimensional latent variable -> recreated input data
  - To train the mapping, you need to minimize the difference between the input data and the recreated input data
  - **This makes up the encoder and decoder components of the autoencoder**
- This is actually crazy smart because it allows for unsupervised learning because you can just give the model the input data 
and it will learn the latent variables used to recreate it
- The encoder and decoder are neural networks
  - The encoder is a neural network that takes the input data and outputs the latent variable
  - The decoder is a neural network that takes the latent variable and outputs the recreated input data
  - These are both different neural networks
- Autoencoding is a form of compression!
  - Naturally, the higher the dimensionality of the latent space the better the reconstruction, but the less efficient the encoding

### Variational Autoencoders (VAEs)

- In normal autoencoders, the latent space is deterministic based on the input
  - This means that the latent space for an input would be a vector of numbers like [1, -5, 3], etc.
- VAEs add some randomness to the latent space
  - Instead of one vector of latent variables, you have a mean and standard deviation of the latent variables
  - This allows us to sample from the latent space to get the sample values of latent variables
  - The latent space is then not a single vector, but two vectors (mean and standard deviation for each latent variable)
    - **The decoding step then samples from this distribution to decode to the output**
- Loss is then defined as: reconstruction loss + regularization loss 
  - Reconstruction loss: is the difference between the input and the output
  - Regularization loss
    - Place a "prior" or initial hypothesis or guess on the latent space distribution
    - The regularization loss is the difference between the latent space distribution and the prior distribution
      - This is also called the KL-divergence
    - **This makes sure the latent variables try to adopt a probability distribution that is similar to the prior distribution**
    - A common choice is to force the probability distribution to be standard gaussian distribution
      - You don't want the network to cheat and memorize the input data
- Intuition for regularization (why we need it)
  - Goals
  1. Points that are close in the latent space should be similar content after decoding
  2. Completeness -- we want sampling from the latent space to be meaningful after content decoding
  - If we just use reconstruction loss the encoding/decoding does not follow these goals
- A forward pass through a VAE
  - Input data -> encoder -> latent space -> sampling -> decoder -> output data
  - The encoder and decoder are neural networks
- By sampling from the latent space, we can generate new data
  1. Sample from the assumed latent space distribution (gaussian because of the regularization term)
  2. Decode the sample to get the output data
  **Note that for new sample generation we don't need the encoder step!**
- **Once trained, the encoder step is only useful for:**
    - Reconstructing input data or analyze the latent space
    - You want to use the encoder for feature extraction and dimensionality reduction
- I *think* this is why most LLMs are decoder-only transformers -- they just use the decoder to generate new samples

#### Training VAEs

- Problem: We can't backpropagate through the sampling step because it's a random process
- Solution: Reparameterization trick
    - We generate the fixed sample vector `z` from the fixed mean vector `u`, a fixed standard deviation vector `s`, and a random noise vector `e` 
    where noise is drawn from the prior
    - This gives us a constant vector for the latent space and allows us to backpropagate through the sampling step

#### Latent Variable Perturbation

- We can slowly perturb the values of the latent space to see how the output changes
  - This allows us to understand the latent space and how it relates to the output
- Ideally we want the latent features to be as independent as possible for the most compact encoding 
  - To encourage independent latent features (*latent space disentanglement*), we can add a loss term that penalizes the correlation between latent features
    - These are called `B` (beta) VAEs, and add a Beta constant multiplier to the regularization loss
      - The higher the beta, the more the model will try to disentangle the latent features
    - Standard VAE is a beta VAE with beta=1

## Generative Adversarial Networks (GANs)

- If you care more about the output than the latent space, then GANs are a better choice
- We just want to generate new instances that look like the training data
- The idea
  - Start from sample data with complete random noise that learns a transformation to the training data
  - The breakthrough idea was to use two neural networks
    - One neural network is the generator
      - This takes in random noise and generates a sample
    - The other neural network is the discriminator
      - This takes in a sample and outputs a probability that the sample is real or fake
      - This is a classifier
  - These networks are at war with each other
    - The generator is trying to fool the discriminator
    - The discriminator is trying to better identify the fake samples
- Intuition 
  - The discriminator outputs a probability that the sample is real or fake, and is trained to get better
  - The generator is trained to get better at following the sample distribution  
  - The intuition is all about building a transformation from a noise distribution to a sample distribution
- Once training is complete, you can use the generator portion to generate new samples
- The generator is trained to take a random vector and map it to a sample in the output space
  - To generate a new sample you can just sample from the random vector and feed it into the generator
- We can interpolate between samples in the noise space and see the output change in the output data distribution
  - This can show you how the noise space relates to the output data distribution


### Training GANs

- The loss for the generator is adversarial to the loss of the discriminator 
- Global optimum: the generator can fool the discriminator 50% of the time 
    - This means the discriminator can't distinguish between real and fake samples

### Examples/Advancements of GANs

- Add more layers in the GANs to get higher and higher resolution images
- Conditional GANs
  - The generator takes in a random vector and a label and generates a sample
      - This label is called a *condition*
  - This allows for *paired transformation between input and output data*
    - e.g. translate from a satellite view to a roadmap equivalent, black and white to color, outlines to color
- Cycle GANs
  - This learns transformations across domains with unpaired data
  - This is all about finding a tranformation to transform the input data domain to the output data distribution
  - Cycle GANs can be used for deep fakes
    - You can train a Cycle GAN to transform a video of a person to a different person
    - You can then use the generator to generate new frames of the video