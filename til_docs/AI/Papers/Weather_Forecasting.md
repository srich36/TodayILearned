# Overview

- Every day, in Italy (and one or two other places around the world) an Integrated Forecast System (IFS) runs 
sophisticated calculations to predict the weather over the coming days
  - This takes an hour to run and is run every 6 hours
  - This whole program costs on the order of magnitude of a billion dollars
- The Google DeepMind team developed a model (*GraphCast*) that can run these predictions in under a minute and surpass the predictions of these 
complex systems
- Previously, weather was predicted by solving *numerical weather prediction* (NWP) by solving the governing equations of weather
  - This scales in accuracy with greater computational resources and more detailed descriptions of weather phenomena
- For medium term weather predictions (up to)
- CNNs could get within 1 degree resolution, but graph neural networks can get up to .25 degree accuracy 
and begin to rival the IFS

## Implementation

- Input: the current weather, the weather 6 hours ago
- Output: a prediction of the weather 6 hours ahead
- A single weather state (one of the inputs/outputs) is represented as as .25 degree lat/long grid
  - This is 721x1440 dim, which is roughly 28x28 km at the equator
- Graph cast is *autoregressive* -- you can increase the time window of predictions by iteratively predicting and feeding 
the prediction back in as input
- This is an "encode-process-decode" GNN with 36.7 million parameters
- 39 years of historical data was used to train the model
- The authors came to a pretty intuitive solution that re-training the model on newer data as it comes will
improve prediction performance
- They purposely constrainted model size (znd thus performance) to get inference < 1 minute and running on one
Google TPU
- GraphCast implementation/training depends on the high-fidelity data of NWP methods
  - Thus, this work is not intended as a replacement, but as a complement