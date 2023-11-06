# Overview

- Paper: Time, Clocks, and the Ordering of Events in a Distributed System
  - Is this the Paxos paper?
- A system is "distributed" if the transmission message delay is not negligible compared to the time
between events 
- **In a distributed system, it is sometimes impossible to say that one event occurred before another**
  - We can only guarantee a *partial ordering* between events
- This algorithm introduces real, physical clocks, and describes a way to synchronize them
  - It also describes a time bound on how far these clocks can drift
- *Concurrent events* are events that could not causally affect one another
  - Even though these events may not happen at the same time, the different processes may not have
  received the messages of their occurrence for one to occur before another

## Clocks

- Logical clocks are defined as some general object that assigns a number to an event
  - These may be implemented as counters with no actual timing mechanism
- It is important that an agreed upon total ordering of events is not necessarily the order in which they actually occur
- For proper clock conditions to hold, each process must increment the clock before successive events
- Each message should contain the timestamp (logical) that it was sent
  - **If process B receives a message from process A, process B should update its clock to be at a time later 
  than A**
    - This is because a message cannot be received before it was sent
- To achieve total ordering of events, we can use these logical timestamps, and break ties based on some
deterministic tiebreaker based on a process number
  - **This gives every portion of the system a consistent view of the events**
- This algorithm functions as a replicated state machine with each distributed process executing the state
machine commands in the same order because of the agreed upon ordering
- "Failure" only matters in a system with physical time (e.g. a request took too long to process)
  - In logical time, this is just a longer pause between events

### Physical Clocks

- Should be a continuous, differentiable function (except for discrete jumps for where the clock is reset)
  - Should have dC/dt ~ 1 (1 per second) where C is clock
  - For the physical clock condition in this system, abs(dC/dt - 1) < some epsilon
- This algorithm requires clocks are never set backwards, with some formula for dictating a maximum clock skew
for globally total ordered events 