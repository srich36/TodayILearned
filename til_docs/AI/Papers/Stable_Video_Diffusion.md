# Overview

- *Stable Video Diffusion (SVD)* and its finetuned variants are text-to-video and image-to-video generation models
- Most prior work involves training a text-to-image model and inserting temporal mixing layers of various forms

## Training

- Training stages
  - text-to-image pretraining
  - video pretraining
  - high-quality video finetuning
- The result: pre-training on well-curated datasets lead to significant performance improvements that persist
after finetuning

1. **Image Pretraining**
   - The initial model is based on an image diffusion model - *Stable Diffusion*
     - This means that the weights are initialized with the weights of the Stable Diffusion model
2. **Video Pretraining**
   - They took subsets of the *LVD* dataset and samples and use human preference to identify the best samples
   - Generating a high-quality dataset here is critical for increased performance
3. **High-Quality Finetuning**
   - Use a dataset of 250k pre-captioned, high-fidelity video clips


## Data Curation

- This paper collected a large dataset of long videos
  - They applied a cut detection algorithm to ensure cut scenes and fades were not included in the dataset
    - These are then split into multiple videos if there is a cut
  - Then, they labeled these videos in multiple ways
    - Annotating the mid-frame with the image captioner CoCA
    - Used V-BLIP to obtain a video based caption
- Then, the researches eliminated low-quality clips (mostly static scenes, a lot of text, etc.)
- They called this dataset is deemed *Large Video Dataset* (LVD) and it contains 212 years of content
- Further filtering of this dataset using Elo rankings from human preference brought this down to 152M examples
  - This dataset *LVD-F*

## Architecture

1. Initial base: Stable Diffusion
2. Add temporal layers, and train on LVD-F
3. Video pretraining on *LVD-F* on 14 frames at a resolution of 256x384
4. Finetune the model to generate 14 320 x 576 frames

These four steps are the *base model* for the video generation. It can be finetuned to better accomplish
specific tasks.
- This base model can do SOTA zero-shot text-to-video generation 

### Finetuning the Base Model

- High-resolution text-to-video model
  - The base model was finetuned on a video dataset of ~1M samples with a lot of object motion and well-aligned captions
  - This was trained for 50k iterations at a resolution fo 576 x 1024
- Image-to-Video generation
  - A few different tricks are used here, one main one being replacing the text embeddings fed into the model with CLIP embeddings of the still image
- Frame Interpolation
  - To obtain smooth videos at high-frame rates, the researchers fine-tuned the base model for frame interpolation 
    - This predicts 3 frames within the start and end frame, effectively multiplying the frame rate by 4
- Multi-View Generation
  - A model finetuned to output multiple views of a given object

### Limitations

- Long-video synthesis is **expensive** both during training and inference 
- Videos generated from SVD sometimes have too little motion
- Video diffusion models are slow to sample and have high VRAM requirements