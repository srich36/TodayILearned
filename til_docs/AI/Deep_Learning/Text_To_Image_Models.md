# Overview

- Why?
  - Text is a very natural control mechanism for generation
  - Large-scale paired image-text data can be found online (LAION-5B)
    - Various biases exist in these datasets
  - Can leverage pre-trained large language models  
- Image editing applications can be built on top of these models
- *CLIP* - An image-text model that can be used for zero-shot classification
  - It can tell if an image and text match -- even complex prompts outside of the training data
- *CLIP score* - A measure of how well the text prompt and image match
- *Cross-attention* - Image and text tokens are input into a transformer together

## Muse

1. Text prompts are provided, gets encoded into a vector (4096)
2. Cross-attention from the text to the image tokens is used to guide the generation process
3. Uses a VQGAN model to generate the image tokens

- Variable ratio masking
  - A random number of tokens are dropped in training as the information makes its way through the network

4. Masked tokens and text tokens are fed into the base transformer model

- When you train a low-res model you first get the scene correct
  - Building higher resolution samples on top of this seems like what they did?
- Muse uses token based super resolution (going from 256x256 to 512x512) rather than a diffusion super resolution
  - This leads to a better output
- Iterative decoding is crucial to good inference quality 
  - The base Muse model uses 24 steps 
- Whenever the count of something goes beyond 6 or 7 the model starts making mistakes
  - The hypothesis here is that the data does not  have examples of counts greater than 6 or 7
- It can render text well as long as there isn't more than one or two words
- Evals for image models are hard because there's no good way to evaluate them
  - Sometimes you just have to look at the images and see if they look good
  - This is an open problem 
- The model seems to generate random scenes even if the prompt is nonsense
  - This is then what gets fed through the decoder
- Muse will generate like 16 images, and then you pick the best one
  - There is no self-correcting way to pick the best image automatically

- Text guided inpainting
  - You can highlight a selection of the image and ask  it to edit that part of the image
  - Outpainting is the opposite of inpainting -- editing the outside of the box
  - Muse can do this zero-shot
  - This is an example of AI image editing
- **Because muse is fast you can do interactive editing**
- The reason why muse is fast is it does parallel decoding
  - In diffusion models, you have to decode each timestep sequentially