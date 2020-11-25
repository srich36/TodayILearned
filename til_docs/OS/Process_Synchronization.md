## Race Conditions

- Can occur when one process/thread grabs a value from memory, updates it, and before storing it back in a register, another processor grabs the outdated value from the register to use

## Hardware Implementations of Memory Exclusivity

1. Memory Barriers
    - All loads and stores currently completing are executed before any other loads and stores on any other processor can start
    - Very low level and typically only used by kernel developers
2. Atomic hardware operations
   - Instructions that can execute in one inseparable unit
   - e.g. compare and swap
     - *Atomic variables* use the building blocks of the compare and swap, etc. to implement basic operations atomically

## Software Solutions

1. Mutex locks
    - Threads must acquire the lock before executing the code within the locked section
    - Will block until the lock can be acquired
      - E.g. must loop in the `acquire` function until the lock becomes available ("busy waiting")
        - This is a "spinlock" since the process "spins" while waiting
    - Essentially a boolean variable of whether or not the lock is available
2. Semaphores
    - Sort of an atomic integer that keeps count of how many resources are available
      - When a process gets access granted to a resource it decrements the integer, when released it increments
      - At 0 resources available it blocks
    - Useful in allowing cases where more than one thread can execute on a given set of resources, but no more than a certain count
    - Processes suspend themselves (put themselves in the waiting queue) when blocked in semaphores to avoid "busy waiting"