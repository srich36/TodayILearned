# Overview

- Emu Video is a text-to-video generation model from Meta
  - This can take a text-prompt as input, or an additional image input
- **The approach is pretty straightforward**
  1. Generate an image from the text
  2. Generate a video from the image and text
  - The idea here is that this is now two sub-problems, and the video generation has a stronger conditioning signal with the two inputs
- This model outperforms commercial solutions like Runway Gen2
- Goals
  - The goal of a text-to-video model is to input a text prompt and generate a video consition of `T` RGP frames

## History

- Large scale text-to-image models are trained on large datasets of text-image pairs
  - While these models can be adapated to text-to-video generation by using video-text pairs, these lag in quality and diversity
- Video generation is more challenging and requires modeling a higher dimensional spatiotemporal output space than images
- video-text datasets are also usually much smaller than text-to-image
- The dominant paradigm in video generation is to use diffusion models to generate all video frames at once
  - So why aren't video generations autoregressive like in NLP?
      - Generating one frame in a diffusion model takes a while and already takes many iterations
- Text-to-video (T2V) generation
  - Most prior works leverage text-to-image (T2I) models
  - Several works try to inject motion information into the T2I 
    - This offers limited quality
  - Many other prior works instead try to learn a *direct* mapping from text-to-video
    - This is accomplished by adding temporal parameters to a T2I model