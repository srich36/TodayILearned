## Overview

- Threads share the resources and memory of their parent process
- Each CPU can have multiple cores, and each core can have two threads (hyperthreading). When you "see" 4 CPU's what you are really seeing is 4 cores
- Hyperthreading: Physical cores are spit into virtual cores known as threads (e.g. 2 cores hyperthreaded to 4 threads with 4 virtual cores)
- Kernel threads vs user threads: Kernel threads are actual hardware threads. Some threading libraries implement user-land threading which is then mapped to kernel threads (this way you can create as many user threads as you want and they will all get mapped to 4 kernel threads for example)
- When you see a "CPU" in linux this is just a unit that can do work (often # physical cores * # threads per core, e.g. 2*2 = 4 CPUs)
- Threads in a programming language can be abstracted over threads on hardware (e.g. 100 threads in software but only actually 8 hardware threads)
  - Kernel threads are the hardware threads
  - Applications schedule threads on a "virtual processor" (Light Weight Program LWP) the OS exposes which then gets mapped to kernel threads
    - Not necessarily one LWP to one kernel thread
    - The kernel itself then schedules these different LWPs onto a physical core - it has no knowledge of the user-threads
- Linux does not distinguish between processes and threads, rather calling them *tasks*
  - Depending on the level of parameters/sharing passed to a `clone` system call the new task starts to look more like a process or a thread
- Can have thread local storage (TLS)
- *Implicit Threading*: Programmers define tasks that can be executed asynchronously and threading libraries handle the creation and dispatching of the threads (e.g. Apple's GCD - grand central dispatch)
- **Threads are smaller than a process**
- Each core can have a thread, but a core can also have two or more cores
  - Only one thread can run at a time though since it needs the core for computation
    - The threads can be switched out during memory stalls/cache misses, to help pipeline complex instructions on CISC architectures (IIRC) etc.
    - This is **hyperthreading** on Intel chips
  - **A processing core can only run one hardware thread at a time** since the caches and pipelines of a core must be shared amongst its hardware threads

## Thread Pools

- A number of threads are created at startup, wait for work, and are assigned tasks and once completed return to the pool

## Cancelling threads

- A signal/variable is sent to the threads indicating that there is a cancel request
- The thread will, in a loop, be checking if its cancellation boolean is set only at times when it can be canceled