# Overview

- [Paper Link](https://arxiv.org/pdf/2312.09237.pdf)
- This paper focuses on allowing vision models to handle *localization*
  - The model can output coordinates, essentially allowing it to *point* to its outputs
  - This densely aligns each output word to a pixel location
  
## Implementation

- The input image and an optional prompt are encoded into the text embedding space
