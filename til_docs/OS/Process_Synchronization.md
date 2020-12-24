## General

- _Priority Inversion_: When a lower priority process is being waited on by a higher priority process to finish in its critical section it inherits the priority of the higher priority process so it cannot be preempted by a process > than the lower priority but < than the higher priority
  - This solution to _priority inversion_ is known as _priority inheritance_
- Newer languages can use memory transactions (like database transactions) that consist of atomic operations
- Since functional languages have immutable data, they are safe from race conditions by default
- Threads first request resources, then release them after they are used
  - e.g. io devices, cpu, `open()` and `close()` for files, etc.
  - A system table records whether each resource is free or allocated
- Resource-allocation graph -> a system graph of threads as vertices with edges pointing to resources
  - A cyclic graph indicates a deadlock may exist
    - Deadlock exists if the requested resource type only has one instance (otherwise, another thread not in the cycle could release that resource and free up a thread)

## Race Conditions

- Can occur when one process/thread grabs a value from memory, updates it, and before storing it back in a register, another processor grabs the outdated value from the register to use

## Hardware Implementations of Memory Exclusivity

1. Memory Barriers
   - All loads and stores currently completing are executed before any other loads and stores on any other processor can start
   - Very low level and typically only used by kernel developers
2. Atomic hardware operations
   - Instructions that can execute in one inseparable unit
   - e.g. compare and swap (CAS)
     - _Atomic variables_ use the building blocks of the compare and swap, etc. to implement basic operations atomically

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

## Deadlock

- 2 or more processes are waiting indefinitely for an event that can only be caused by one of the waiting processes
  - e.g. a `signal()` to release a resource
- Windows/Linux leave deadlock protection up to kernel developers
- Databases detect and recover from deadlocks
- To prevent deadlock by preventing circular wait, you can assign each resource a numeric ID and only allow requests in an increasing order of ID. This way thread one won't request resource 1 then resource 2, while thread 2 requests resource 2 then resource 1
- Deadlock avoidance algorithms
  - Resource requests from threads are only granted if granting the resource will keep the system in a safe state (guaranteed to prevent deadlock)
- Since deadlock occurs so infrequently, sometimes it is just ignored. Deadlock avoidance algorithms can cause low throughput

#### Deadlock Detection

- Check for cycles in a wait-for graph
- Database transactions use locks and thus require deadlock detection algorithms
  - Periodically search for cycles in the wait-for graph. If a cycle is detected, choose a victim transaction to abort, freeing up the resources. Once the remaining transactions complete, re-issue this transaction

## Livelock

- When a thread continuously attempts an action but fails

## POSIX APIs

- `pthread_mutex` for a mutex implementation
- `sem_open` etc. for a semaphore implementation
- Condition variables -> `pthread_cond_wait` -> wait on a lock until a given condition is met
