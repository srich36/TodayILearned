## Overview

- Whenever the CPU is idle, the OS must select a process in the ready queue to be executed
  - Not necessarily a queue, can be a heap, tree, etc.
  - The records in the queue are process control blocks (PCBs)
- The *dispatcher* gives control of the CPU's core to a process
  - **dispatch latency:** the time it takes to stop one process and start another
- Objective: maximize of combination of CPU utilization, throughput, waiting time, response time, and turnaround time


## Scheduling

- Preemptive vs. non-preemptive scheduling
  - In non-preemptive scheduling a process keeps the CPU until it releases it
  - In pre-emptive scheduling, a process can be "preempted" by another process which takes the CPU resources
    - All modern OS's use preemptive scheduling

## Scheduling Algorithms

- First come first serve
  - Most basic. Pretty bad
- Shortest job first. Greedy.
  - Optimizes minimum average weight but cannot be implemented at the CPU level because you don't know how long the CPU burst will be
    - Predicted as an exponential average
- Round robin - each process gets the CPU for a given time unit, then an interrupt returns control to the CPU
  - most modern systems have this time unit, the *time quanta* on the order of magnitude of 10-100ms
    - the context switch duration is on the order of magnitude of 10ms
- Priority Scheduling
  - Each process is assigned a priority and the process with the highest priority is selected to run
    - Has problems with indefinite blocking/starvation (e.g. low priority processes waiting indefinitely)
      - Aging: gradually increasing process priority with time
    - Implemented with a **multilevel queue**, one queue for each priority level, and pulls processes from the highest priority first (can be used for foreground/background queues, etc.)


## Multiprocessor Scheduling

- Refers to any system with multiple cores (most computers these days)
- Symmetric multi-processing (SMP) each processor is self-scheduling
  - Generally, each processor maintains its own thread queue
  - **Load balancing** is used to make the ready queues of threads for each processor similar in work-level
    - Can pull a thread from another core when idle, and/or push threads from one processor to another when busy

## Threads

- Use system contention scope (SCS) to determine which kernel-thread to schedule on a core
  - Generally a priority based system

## RTOS

- Tasks must be serviced by the end of their deadlines
- Event Latency:
  - The time for the system to finish executing its current instruction, read the interrupt, and context switch to the interrupt service routine
  - Real-time systems must bound this latency to service the tasks
- Dispatch Latency:
  - The time for the dispatcher to stop one process and start another
- Since RTOS's (real time operating systems) must immediately respond to events requiring the CPU their scheduling algorithms are priority-based and preemptive
- **Admission control**: A RTOS scheduling algorithm will wither admit or reject a process if it knows that it cannot possibly finish servicing the process by the deadline

#### Scheduling Algorithms for Real-Time Processes

- Rate-Monotonic: Shortest period processes assigned higher-priority
  - Optimal for static priorities but can't guarantee in-time completion
- Earliest-Deadline First: Greedy
  - Dynamically assigns priorities based on the deadline
  - Theoretically optimal (think scheduling leetcode problem) but in practice may require a lot of context switching
- Proportional Share: Each application gets some proportion of the total time cycle

## Linux Completely Fair Scheduler (CFS)

- Default scheduling algorithm used in Linux
  - Based on scheduling classes, each which are assigned a priority
    - e.g. real-time, non real-time
      - all real-time has higher priority
    - The algorithm then selects the highest priority process within the highest priority scheduling class to run
- Processes are assigned a proportion of the CPU time based on the *nice* value
  - Nice values are then mapped to actual priority values (real-time priority supersedes any nice value)
- Keeps track of how long each task runs through a given CPU burst in the `vruntime` (virtual runtime) process-level variable
  - This is weighted with nice value (a high nice value, i.e. low priority, will have a higher `vruntime` recorded)
  - The scheduler then selects the process with the lowest `vruntime` to run next
- Each runnable task is stored in a **balanced red-black tree** (BST) with its key being based on the value of `vruntime`
  - Caches the smallest value so it doesn't have O(log(n)) retrieval
