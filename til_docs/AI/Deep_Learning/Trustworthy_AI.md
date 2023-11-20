# Terminology

- *Aleatoric uncertainty* - Data uncertainty -- very similar inputs that have very different outputs
  - Cannot be reduced 
- *Epistemic uncertainty* - Model uncertainty -- no samples in the training data that are similar to the input -- points input points there are outside the distribution
  - Can be reduced by adding more data to regions of the input space with high model uncertainty

# Overview

- How can we deploy safe, unbiased, and trustworthy AI?
- The gap between innovation and deployment of models are failures and biases
- Challenges
  - Bias: What happens when models are skewed by sensitive feature inputs?
  - Uncertainty: Can we teach a model to recognize when it doesn't know something?

## Bias

- Bias types
  - Sampling bias: The data is not representative of the population
    - e.g. Clinical data -- sampling more healthy people than sick people because getting data is easier
  - Selection bias: The data is not representative of the population
    - e.g. Siri trained on American english 
    - This is very common for facial detection models
  - Bias from deploymnets
    - Distribution shift: The data used to train the model is different than the data used to deploy the model
      - e.g. A model trained on data from 2010 is deployed on data from 2020
    - Feedback loops once the model is deployed 
    - Evaluation bias -- if the evals don't match the full diversity of the real world

### Bias Mitigation

- *Sample reweighting* - Sample more data points from underrepresented groups
- *Loss reweighting* - Weight the loss function to penalize errors more on underrepresented groups
- *Batch Selection* - Choose randomly from all classes of data so each batch has a representative sample
- Debiasing Latent features
  - To reweight, etc., you have to label your data!! You can't use unsupervised learning because you don't know what the bias is
  - We want a way to: learn the latent features of the data, and then debias the latent features
- Mitigating bias through learned latent structure -- this can 
    1. Learn latent structure 
    2. Estimate distribution of latent structure -- calculate the probability that a certain combination of features will occur
    3. We can oversample from the sparse regions of the latent space to get more data points
       - This avoids the whole manual labeling process
    - How does the math work?
      - Consider a discretized histogram of each latent variable
      - Multiply the histogram for each latent variable to get the joint distribution
  - This is very creative 

### Other Examples of Bias in Models

- Autonomous driving
  - Mostly sunny weather, straight roads, etc.
  - There isn't as much data for rainy weather, snow, etc.
    - You can use bias mitigation techniques to get more data for these scenarios
- Language models
  - These encode gender biases
- Healthcare recommendation algorithms
  - These can encode racial biases

## Uncertainty

- Models output a probability distribution, regardless of input
  - **This is not a confidence score**
- Uncertainty estimation gives us a **confidence score** for the model as well as the probability distribution 
- Types of uncertainty
  - *Data uncertainty* (*Aleatoric uncertainty*) - very similar inputs that have very different outputs
    - **Data uncertainty is irreducible**
    - All types of models (e.g. image classification, regression, etc.) have data uncertainty
  - *Model uncertainty* (*Epistemic uncertainty*) - no samples in the training data that are similar to the input -- points input points there are outside the distribution
    - This can be reduced by adding more data to regions of the input space with high model uncertainty
- Estimating aleatoric uncertainty 
  - Goal: learn a set of *variances* corresponding to the input
    - Higher variance = more noise
    - This variance is a function of the input `x`
- Training a model that also has variance
  - We can use a loss function that takes variance into account
- Estimating epistemic uncertainty
  - What if we train the same network multiple times (an *ensemble* of networks) and compare outputs?
    - All of these should have the same hyperparameters
    - This works because for familiar inputs the networks should converge on similar outputs
    - For unfamiliar inputs, the networks should diverge on outputs
    - **This is costly and expensive**
  - Instead, we can use dropout layers to introduce stochastisity into the model
    - We've seen these be used at test time to prevent overfitting
    - We can keep them at inference time to estimate epistemic uncertainty
    - This sampling can still be pretty expensive
  - Another way to estimate epistemic uncertainty is to use reconstruction error to measure how confident a model is in a prediction
    - **This is just an autoencoder or VAE!!**
    - We then have to train a whole decoder to test this...which is also expense
  - One last way to learn the variance **directly** by placing priors on the distribution  
    - This is the most advanced and compute-light way to do this


#### Themis AI Capsa

- This is an open source library Themis built that is a model-agnostic framework for risk estimation
- Adding one-line, this can calculate biases, uncertainty, etc. for any model
  - This works by wrapping models so that they are *risk-aware* by changing the components that need to be changed