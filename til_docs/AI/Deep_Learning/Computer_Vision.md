## Terminology

- *Convolutional Neural Network* - A neural network that uses convolutional filter layers to extract features from datasets
  - Very useful for extracting image features and processing other data in a grid-like format
- *Semantic Segmentaion* - A computer vision task where the goal is to classify each pixel in an image
  - This is different from object detection because the goal is to classify each pixel, not just identify objects
    - This gives us a greater understanding of the image

## Overview

- How does a computer *see*? How does a computer process images?
- Computers see images as a 2D array of pixels, where each pixel is just an RGB matrix of values
- Computer vision tasks
  - Regression - output a continuous value (e.g. where is the bounding box for an identified object)
  - Classification - output a discrete number of class labels
    - Can be done by identifying the features of an image and then classifying the image based on those features
- The applications of CNNs are enormous -- it all revolves around feature extraction
  - This is the core of computer vision
  - Once the features have been extracted, any other model architecture can be used to process the features in 
  whatever desired capacity

## Features

- High Level Feature Detection
    - Detect features in an image (nose, eyes, wheels, license plate, door, windows, steps)
- A computer vision pipeline requires two steps:
    1. Identify relevant features we're looking for
    2. Detect those features in the image for classification
- The pipeline needs to be independent of viewpoint, scale, illumination, deformation, background, etc.
  - This is a tough problem to solve
- Neural networks are able to learn features directly from data, and can learn a hierarchy of features (getting more complex) using multiple layers

## Convolutions

- Could we represent this as a fully connected neural network?
  - We'll need to flatten the 2D array to a 1D representation
  - **No spatial information is encoded here!**
  - We'd need an enormous number of weights to represent this (100x100 pixel image would require 10,000 weights)
- Using spatial structure in the input
  - Input represented as a 2D array of numbers
  - We can connect *patches* of the input to neurons in the next layer
  - Each neuron in the next layer only sees a small part of the input
  - This is called a *convolutional layer*
    - It's a convolution because the *patch* is a "sliding" filter over the input, which each neuron in the next layer seeing a different patch
    - This "sliding" is how convolutions work
  - How can we weight the patch to detect particular features?
- Convolution process
  1. Apply a set of weights (a filter) to extract local features
  2. Use multiple filters to extract different features
  3. Spatially share parameters of each filter
- **You need a sliding window because you need to preserve spatial information** (to do this, you *have* to look at more than one pixel at a time)
  - This makes these models robust to viewpoint changes, background, etc.
- **Conceptually, each filter (described by a set of weights) is designed to detect a particular feature**
  - The weights are learned by the model
- A convolution is just an element-wise multiplication of the filter and the input
- The next layer is another "image" that's created by the convolution -- the image is built up on the output of the convolution
  - Different filters can detect different features or modify the image in different ways (e.g. sharpen, edge detection, etc.)
- Learning the filters are about learning the weights

## CNNs (Convolutional Neural Networks)

- This is the core model architecture for computer vision
  - Steps
    1. Convolution: apply filters to generate feature maps
    2. Non-linearity: apply a non-linearity activation function (oftern ReLU)
    3. Pooling: downsample the feature maps to reduce the number of parameters
    4. Feed the features to a fully-connected neural network to classify the image -- we can use the standard 
    fully-connected neural network architecture since the image has been broken up into features and is no longer a 2D input
- Computing a neuron in the hidden layer:
  1. Apply convolution to the input
  2. Compute the weighted sum of the convolution
  3. Apply a bias to the weighted sum
  4. Add the non-linearity
    - For CNNs this is generally ReLU which is just max(0, x) for each pixel
- Each neuron in then only sees a portion of the input
  - This is important because it allows the model to scale as it doesn't need a crazy amount of weights
- A single convolutional layer may have multiple filters
  - We should think of the layer as outputting a 3D volume (collection of 2D "images" of feature maps)
  - The output is spatially described as hxwxd, where d=depth which is the number of filters
- Pooling
  - Reduce the dimensionality of the image as you go through the convolutional layers
  - Max pooling: Sliding window that takes the max value of the window 
    - This just reduces dimensionality of the output, but preserves the features because the max value is preserved
  - A pooling layer takes in the output of a convolutional layer and outputs a smaller volume
    - So the layers are structured as convolutional -> pooling -> convolutional -> pooling, etc.
- In a CNN, we can conceptualize this as:
  - The first layer detects edges
  - The second layer detects shapes (eyes, nose, mouth, etc.)
  - The third layer detects objects (faces, cars, etc.)
  - Each successive layer is detecting more features
- A CNN for classification has two key parts:
  1. Feature extraction
     - Convolutional layers
  2. Classification
     - Fully connected layers
     - Can do this using a softmax function -- **this just collapses the output into a probability distribution**
- CNNs are super powerful because they are designed to extract features -- anything after that can be very flexible
  - What you do with the features can use any architecture
- Object Detection
  - This is both a classification problem **and** a regression problem
  - Naive approach: draw a random box on the image and feed that box into the CNN for classification
    - Repeat this for many random samples
    - There are obviously way too many random samples to do this
  - R-CNN algorithm: Find regions we think have objects, then use CNN to classify the object
    - This is brittle and slow
  - Fast R-CNN algorithm: Use CNN to find regions that have objects, then use CNN to classify the object
- **All of these different model architectures that involve images all start by using the same feature extraction steps**
  - They then can branch of with what to do when the features are extracted

### Use Cases

- iPhone uses this for all images
- Autonomous vehicles
- Medical imaging, etc.