## Overview

- Process state is stored in a process control block (PCB)
- Processes can create child processes, building a tree-like process structure
  - e.g. `systemd` is pid 1
  - run `pstree` to see this tree
  - To create a new process in Unix systems, the syscalls are `fork` (create a copy of the parent process), then `exec` to replace the process memory space with a new program
- Processes terminate with the exit system call
- "zombie processes" - processes that have terminated but whose parents have not called `wait()` on
  - These processes still have their information in the process table
- Can be single or multi-threaded
  - Recall, a process is not implemented as a separate thread, the CPU switches between the processes
- To send signals to processes use the `kill(pid, signal)` function

## Scheduling

- As processes come into the system they are placed into a ready queue
  - Generally stored as a linked list
- Processes waiting for IO to complete are placed in a wait queue
  - After the IO is processed, they go back in the ready queue
- After a process is dispatched (allocated CPU and is running), if it runs out of its time slice it is put back in the wait queue

### CPU Scheduling

- A CPU scheduler selects from the ready queue and assigns CPU resources to them
- Swapping is when a program is "swapped out" from memory to disk (and thus is no longer in contention for CPU resources) and is brought back when necessary and has its status restored
  - Typically only necessary when memory needs to be freed up

### Context Switch

- The CPU performs a state save of the current process PCB, then does a state restore of another process
  - This is purely overhead
- This happens when interrupts occur, etc.

### Web Browser Processes

- In order to not crash the entire browser when a tab crashes, a web browser process is broken up into separate components
  - 1. The browser process (only one of these)
  - 2. Renderer process (one per tab)
  - 3. Plug in process

## Inter-Process Communication

- Can use pipes
  - Ordinary pipes: standard pipes, unidirectional data
  - Named pipes: Persist beyond when processes are communicating with one another and allow for bidirectional communication
    - These are called FIFO's in Linux
- Can use shared memory (two processes read and write to the same memory)
- Can use a message passing interface with a message buffer

## RPC's

- Messages are sent with identifier of function to call, and parameters to pass to that function to an RPC daemon running on the other machine
  - This implementation is hidden behind client side stubs
  - A server-side stub receives the message and then processes it
- A rendezvous daemon listens on a well-known port for incoming requests for a given RPC name and returns the port of that RCP call the client should sent the message to