# Overview

- Vector embeddings at its core are just about representing data objects as vectors of numbers
- These vectors are **generated from machine learning models**
- The vectors are generated in such a way that similar objects are close together in vector space
  - e.g. "kitty" and "cat" are close together in vector space
- These vectors can then be searched for similarity, assuming the search query is embedded using the same algorithm
- Vector embeddings don't have to be for *just* text
  - They can be used for audio (this is how Shazam recognizes songs)
  - Time series data
  - 3D models
  - Video
  - Molecules
- Older versions of embeddings models were not context-dependent - each word was static
- Transformer models take the entire input context into account when generating the embedding
- **Multi-modal models**: Are models that take input from an understand different *modalities* (e.g. text, audio)
  - They can use vector embeddings to represent the different modalities in the same vector space  
  - Text-to-image is a good example of this