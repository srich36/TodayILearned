## Terminology

- *Robots* - Machines the put compute in motion

## Overview

- Machines can be
  - Descriptive - Explaining what is happening
  - Predictive - Predicting what will happen
  - Prescriptive - Prescribing what should happen and determining what it should do
- Robots require a body (hardware) and a brain (software)
- There are three types of learning for robots (similar to other ML models)
  - Supervised learning - Learning from labeled data
  - Reinforcement learning - Learning from rewards [RL](./Reinforcement_Learning.md)
  - Unsupervised learning - Learning from unlabeled data

### Decision Making for Robots

- This contains three stages
    - **Perception** - The robot needs to perceive the world around it
      - This is done through sensors
      - A CNN is used to do image segmentation (label different parts of the image as certain classifications)
          - State of the art is like 90% -- this is not good enough for robotics (e.g. cars)
      - There are a lot of potential attacks like adversarial perturbations that you need to be aware of
    - **Planning** - The robot needs to plan what it should do
      - This is done through a model of the world
      - This is the brain of the robot
    - **Action** - The robot needs to act on the world
      - This is done through actuators
      - This is the output of the robot
- Reinforcement learning [RL](./Reinforcement_Learning.md) is used for the planning and action stage
  - This differs from supervised learning because you don't need input/output pairs

### Fully Autonomous Vehicles

- Lidar made a huge difference in enabling autonomous vehicles
  - Before we only had sonar which wouldn't work
- Sensors don't work well in weather
  - **The uncertainty of the sensors increases greatly of rain or snow**
- Uncertainty also increases hugely in congested areas, with other objects on or near the road, etc.

The *Traditional* A/V pipeline

1. Process sensor data
2. Detect obstacles
3. Localize the car relative to the other objects
4. Plan a path
5. Actuate the car

**How do you connect these modules together -- through what parameters**?
- Using a large dataset we can *learn* an underlying representation of driving based 
on how humans drive in similar situations
- How can we use machine learning to go **directly** from perception to actuation (cutting out all of the middle parts)
- Can train a deep neural net to go from the raw perception input data to actuation  
  - Input: 
    - Sensors: Camera, lidar, etc.
    - Coarse Maps: GPS
- We need a lot of data to train this model
  - We can generate this in simulation, see [Vista](https://vista.csail.mit.edu/) and [Vista Noes](./Reinforcement_Learning.md)

### Autonomous Recipe - Making your car autonomous

1. Make car drive by wire
2. Extend the car with cameras, lidars
3. Use existing software modules 
    - A perception module
    - An estimation/learning module
    - A planning/control module
