## Background

- A general recommendation process is as follows:
  1. Retrieve content from multiple sources to get candidate pieces of content to show to the user
  2. Rank the candidate set based on relevance scores predicted by a machine learning model
  3. Return the top `k` results that are relevant to a user
- Features are the relevant inputs to a machine learning model
  - User-provided data (e.g. demographics, ratings, etc.)
  - Model derived features (features extracted by models, etc.)
  - Post data (e.g. clicks, click-through rate, etc.)
  - Contextual features (what time it is, what day it is, etc.)
- **A strong recommendation engine needs to have good features provided to it**
- What constitutes a good recommendation service?
  - Remembers users short and long-term interestse
- **In online recommendation systems, read performance is more important than write performance**

## Monolith -- A Recommendation Engine

- Monolith [paper](https://arxiv.org/pdf/2209.07663.pdf)
- Traditional deep-learning stacks are comprised of a training stage, and then an inference stage
  - This does not allow the models to adapt to human feedback in real-time
- *Monolith* is a system tailored for online training
- Challenges
  - Recommendation features are sparse
  - Training data and real-time preferences drift over time
- The architecture generally follows TensorFlow's distributed Worker-ParameterServer setting

## Implementation

- Monolith uses a collisionless hash table and online training to solve the two key challenges
- Collisionless hash table
  - This uses cuckoo hashing 
  - The hash table doesn't insert all IDs (IDs are identifiers of some sort of feature) but only the more popular ones (because this gives better recommendation accuracy) and evicts old keys
    - This is done to reduce memory footprint

### Training

- Training is split into two stages
  - Batch training
  - Online training
- In batch training, the model is initially trained on training examples
    - After batch training is complete, the model starts serving and enters the online training phase
- There are two model instances: the training model, and serving model
  - These start out the same
- Online training
  - The training model operates on training data in real-time, pushing parameter updates to the training model
  - Periodically the training model syncs its parameters to the serving model
    - This allows the model to react immediately 
- A flink stream creates training examples and dumps them to a kafka queue for training consumption
- **Negative examples (e.g. the user did not like a post) generally far outweigh positive samples (user liked a post)**
  - To offset the negative examples are sampled

--- 

## IPS (Instance Profile Service)

- [Paper](https://www.cs.princeton.edu/courses/archive/spring21/cos598D/icde_2021_camera_ready.pdf)
- IPS is a service built by ByteDance that powers the feature calculation for machine learning models for ByteDance products
  - Models receive input features from IPS to power recommendations
- Essentially when feature engineering you can run SQL queries over IPS to extract the features you need
- The paper goes into much more detail on the data model
  - One profile is comprised of a set of *slices* where each slice represents a piece of the profile's history
  - Feature data is also hashed for privacy reasons
- **Recommendation systems typically request 10s or 100s of features from IPS to make a recommendation**
  - Feature counts are collected and aggregated in different window sizes and cannot be cached effectively so they are computed in real-time
- IPS is just a service that allows for inserting user actions/feature statistics and querying for features
- IPS is a cluster that can have multiple separate deployments
  - Different features within different apps may or may not have their own IPS cluster for their recommendations
  - ByteDance has more than 50 IPS clusters in production

### Architecture

- IPS is split up into 3 layers, with data hashed across nodes using consistent hashing
  1. Application layer
    - Flink jobs add real-time data into IPS
    - Spark jobs add batch data into IPS
  2. Compute cache layer
    - This does the actual querying + merging, etc.
  3. Storage layer
- Layers communicate using Apache Thrift (a protobuf alternative)
- To prevent time slices of a profile from growing indefinitely large, these are either compacted or truncated
  - In compaction, the value is updated with the given reduce function (e.g. `sum` or `max`)
  - This is similar to computing incremental motor temperatures, etc.
- The caching layer is a **super simple** map of user id -> an entire serialized and compressed profile
  - Periodically this is flushed to disk and on a cache miss it is loaded into memory
- There is a separate write table to separate read and write traffic so read workloads (more important) don't have as much lock contention in the main table
  - Periodically the separate write table is merged with the main table by applying aggregate functions (e.g. clicks are summed over the past few seconds, etc.)