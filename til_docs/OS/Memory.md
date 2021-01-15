# Overview

- NUMA: Non uniform memory access
  - Multiple processors share the same address space but have much quicker access to their local memory
- The computer can only access main memory directly
  - things in other memory must be moved to main memory before they are operated on
  - This can be changed if you are using virtual memory (otherwise programs could never be larger than RAM)
- Some registers can be operated on in one clock cycle
  - The computer needs many clock cycles to operate on main memory -> this is why it is brought into registers
- Dynamic Loading
  - Certain portions of the program are only loaded in when needed at runtime to reduce the size of the executable
- Dynamic Linking
  - Libraries are linked at run-time -> the can be shared among processes, don't need to take up all of main memory, etc.
- `ASID`: Address space identifier -> uniquely identifies the process and provides address-space protection for it
- **address translation** the process of translating a logical memory address to a physical one (through paging, etc.)
- `x86` actually came form AMD first (you can refer to them individually by Intel 64 and AMD 64)
- A 64 bit architecture simply means 2^64 bits of memory can be addressed (because the main thing bits are used for is memory addressing)
- Reentrant code -> code that does not modify itself during execution
- Each page has a modify bit that is set when it is written to to indicate to the OS that it has been changed
- Databases provide their own memory management and IO buffering
  - Databases implement algorithms more suited to their needs rather than use the general purpose OS algorithms
- Most of the time paging is transparent to the user, but in lower level languages structuring data so it takes advantage of locality may reduce page faults
- A controller for a USB storage device is generally given the number of bytes to transfer and a memory address for the buffer to transfer to. When the transfer is done the CPU is interrupted
# Memory Management Schemes

- Programs must be kept in main memory to be executed
  - On modern systems, many processes need to be kept in memory
    - Each process has a separate memory space so they don't interfere with one another
    - Each process has a `base` and `limit` register which is the `base` address it can access and the range of memory addresses it can access (in limit)
      - Any address generated by a process that is not within this range is treated as a fatal error
    - Using a paging scheme, processes cannot address any memory outside of their pages, which protects against invalid memory access so this is not needed

## Address Binding

- The compiler binds addresses used by programs to an offset of the start address of wherever the program is loaded
- The linker/loader then binds these to absolute address when it is loaded into memory to run
- Logical/virtual address -> an address generated by the CPU with perspective of the program
- Physical address -> the physical memory address on the hardware
- Mapping from logical addresses to physical addresses is done at runtime by the _MMU_ (Memory Management Unit)
  - This allows the compiled program to be memory address agnostic

## Allocating Memory

- OS's are generally located in high address space
- Naive method -> contiguous memory
  - Each process has a block of contiguously allocated memory
  - When a new process comes in, the OS looks for blocks of open memory, then allocates it to the process if memory is available
    - The blocks are variably sized
  - This leads to _memory fragmentation_ where there are a bunch of little unoccupied blocks of memory between processes that are not large enough to host new processes coming in (these blocks arise as processes comme and go due to the variable size)
- Modern approach -> _paging_
  - Memory is allocated wherever it is available
  - Implemented in cooperation of the OS and hardware
  - Physical memory is broken up into fixed-size blocks called _frames_ and these _frames_ are related to logical memory blocks of the same size called _pages_
    - The system maintains a linked list of free frames to allocate to processes when necessary
  - When a process is loaded, its _pages_ are loaded into any available frames
    - This way the logical address space (_pages_) are decoupled from the physical memory frames
  - Addresses generated by the CPU are thus generated with two parts
    - `page_number`, `page_offset` -> these can be used to get the physical memory address
      - The `MMU` does this decoding -> cooperating of computer hardware/software
      - page size is determined by hardware
      - e.g. 4096 bytes on Linux (4 kB)
  - Page tables are maintained per-process
  - The first part of the logical address for pages contains the page number, then the second part contains the offset into that page

### Accessing the Page Table Efficiently

- Since the page table is large, it must be stored in main memory
- Thus, to translate an address, you first have to hit main memory to get the address, then access main memory again
- To prevent this, there is a really fast hardware `TLB` (Translation look aside buffer) which essentially acts as a cache (LRU on TLB misses)
- There are generally multiple levels of `TLB`'s to avoid that main memory access
- TLB reach is the number of memory address accessible from the TLB (the number of entries in the TLB * page size)

### Storing the page table

- Since the page table might get extremely large, pages themselves can be paged and stored in a hierarchical manner
- Modern systems use hashed page tables


### Instruction Execution

1. Instruction is fetched from memory
2. Instruction is decode (translate opcode to actual meaning)
3. Instruction is executed
4. Results are stored back in memory

## Swap
- Memory - pages of a process - are swapped out of main memory to a backing store when a process is inactive and main memory is full
  - Swapping leads to lower throughput as there is less memory available than is necessary
- Linux can use a swap file or a swap partition
  - Swap file: Just a normal large file in the OS
  - A swap partition is more performant because it uses raw IO
- The swap space is broken down into 4kb page-slots to hold swapped pages

## Program Structure

- A single binary is usually structured with the code itself starting at a virtual address of 0 (everything else is just relative to this virtual address, when executing this will get mapped to a physical address by the MMU)
- After the code segment there is a data segment for all the variables
- The stack is allocated at the other end of the address space and is allowed to grow towards the heap (after the data segment)

## Virtual Memory

- Allows the OS to execute programs that are not fully in memory
- This is the separation of logical from physical memory
  - The virtual address space is the logical memory view of a programs memory
  - Typically each program starts at a certain logical address (e.g. 0, and continues contiguously in memory)
- Demand paging: Memory pages are only loaded as needed by a program
  - Applications generate a *page* fault when the necessary pages aren't loaded into memory, causing the OS to bring the desired page into main memory and rerun the failed instruction (pages are stored in swap-space when they aren't in main memory)
    - Major page fault: The page is not in memory
    - Minor page fault: The page is in memory but there isn't a reference to it in the program's page table (e.g. when using shared libraries)
  - This needs to happen extremely rarely for the performance degradation not to be crippling
  - Demand paging is used, however, in modern operating systems and in mobile
- Copy on write: when a child process is created, its pages are initialized to the parents pages. Only if a process writes to these will the pages be copied (otherwise the child process will probably issue the `exec` system call and change itself anyway)
  - This is used by Linux, Mac, and Windows

## Page Replacement


  - This is in favor of swapping **entire** processes (which aren't really used anymore, just pages are swapped)
  - The page being swapped out's contents are written to swap memory to free up the frame

### Page Replacement Algorithms

- Optimal algorithm: Reduce the page that won't be used for the longest time. Greedy lol.
  - You obviously can't know this ahead of time so this is just the idealized benchmark
- This leads to an LRU algorithm
  - This makes sense with hot code paths, etc.
  - This requires extensive hardware support as "timestamp" (e.g. clock cycle count) fields must be updated on every memory reference
- Approximate LRU algorithms are used on systems without this hardware support
  - A reference bit is set when a page is accessed (not indicating the order however) so the OS can see which pages have been used
- *Lock bits* - if a page has a lock bit set, it cannot be paged out (e.g. some kernel memory, pages with a buffer waiting for IO)

#### Approximate LRU Algorithm

- You can implement this pretty cleverly. Every x units of time (e.g. 100 ms) you can interrupt and record the value of the reference bit for each page
- Each page then has a register of the last 8 records of the time cycles. e.g. `11100100`. Every time a new value is recorded the bits in these registers are shifted right
- Thus, the register with the lowest value is the page to be replaced

#### Second-Chance Algorithm (a.k.a The Clock Algorithm)

- Instead of storing all the page values, the OS proceeds in a FIFO manner and checks if a page's reference bit is set (the page has been referenced recently)
  - If not set, the page is swapped out
  - If set, the reference bit is cleared and time reset to the current time "giving it a second chance." The OS will then proceed throughout all the FIFO pages and only swap the original page out if the rest of the pages also have their reference bit set.

### Frame Allocation

- *Proportional allocation* - Frames are allocated to a process in proportion to the size of the process
  - This can also be on a priority basis, as higher priority processes are given more frames
- *Global replacement* - when a process needs a frame replacement, instead of replacing one of its own frames, it can replace a frame of another lower priority process's memory
- To prevent *thrashing* (a process not having enough frames, pulling a page in and thus having to replace another one of its pages, causing more future page faults in a cycle) the system may define a working set
  - The working set is the set of frames that the process has used over the past `n` time intervals
  - This takes advantage of locality
  - High disk utilization, low CPU utilization
- A better approach to thrashing prevention is allocating more frames if the process reaches a threshold page-fault frequency
- Kernel processes are allocated memory from a different pool of frames
  - Memory is allocated according to kernel data structures in SLABs -> created beforehand so it can just be assigned and released without having to initialize the pages continuously
  - These are blocks of contiguous memory of various sizes

### Freeing Up Memory 
- When available memory gets low, *reapers* (processes that free up pages) reclaim pages from processes
- When memory gets really low, the kernel may trigger an OOM killer (Out of memory) that selects a process to terminate and frees up its memory
  - See the OOM scores in `/proc/<pid>/oom_score
- Linux has a `kswapd` daemon that acts as a reaper

### Frame Compression

- Mobile uses frame compression when frames are running low since they don't support swapping
  - Squishes down multiple frames into one frame

### Prepaging

- To help reduce the initial number of page faults that come from on-demand paging you can prepage - bring multiple pages into memory at once