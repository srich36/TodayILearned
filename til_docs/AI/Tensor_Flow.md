# Overview

- Made by Google, open source, useful for machine learning and building neural networks
- *Keras* is the high-level API for TensorFlow
  - You should always use the Keras API for TensorFlow
    - Very few problems need to be solved at the low-level core TensorFlow APIs

## Concepts

- `tf.keras.layers.Layer` - This is the fundamental abstraction in keras
  - A layer encapsulates a state (weights) and some computation (the `call` method)
- `tf.keras.Model` - Provides the fundamental abstraction for a neural network 
  - The `call` function of the model defines the network's forward pass
  - The `summary` method can be used to print a summary of the model architecture
- `Sequential` API - Allows you to build a model by stacking layers on top of each other
  - This is the simplest way to build a model
- Automatic differentiation - TensorFlow automatically computes gradients for you for backpropagation training
  - This is done by the `GradientTape` API
  - `GradientTape` records operations for automatic differentiation
    - So the tape knows which operations to record in the forward pass so they can be optimized in the backward pass
    - The most common use case is to compute the gradient of the loss with respect to the models trainable variables1
      - `tape.gradient(loss, model.trainable_variables)` is the most common use case to abstract away the backpropagation

### Layer Types

- Tensor Flow provides layer abstractions like a `Dense` layer 