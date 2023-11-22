# Encoding Structure in Models

- CNNs: Using spatial structure
  - The core idea is around convolution -- this preserves spatial information
  - This works because we represent the data as a 2D array as the input to the model
- Graphs as a Structure for Representing Data
    - Graphs are a really powerful way to represent data
    - Many real-world data (such as networks) can't be encoded in Euclidean data structures
- Graph Convolutional Networks (CGNs)
  - The idea is similar to standard CNNs -- the convolution is slid over the different nodes + neighbors and extracts features
  from the local neighborhood of the graph
  - Graph encoding is a new technique that can be used to datasets that naturally have a graph structure
    - e.g. Molecular discovery


## Applications of Graph Neural Networks

- Drug discovery -- discover novel antibiotics
- Traffic prediction -- predict traffic patterns
  - This led to significant ETA improvements in Google Maps
- COVID-19 Forecasting
  - This was modeled as spatio-temporal data

## Learning From 3D Data

- Learning from point clouds!
  - Unordered sets of points in 3D space
- You can extend graph neural networks to point clouds
  - The idea is to use a graph to represent the point cloud
    - You can dynamically construct a mesh based on the point cloud

