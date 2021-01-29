# Overview

- A "word" is the native unit of data for a computer architecture (e.g. 64 bits on an 64 bit architecture)
  - Many instructions are executed at this native word size rather than a byte at a time
- The kernel will set a "mode bit" to indicate user space vs. kernel space processes (triggered by a trap or interrupt)
  - Hardware can only be accessed in kernel mode
- A system call is usually just a trap to a specific location in the interrupt vector (or a `syscall` instruction)
- To ensure the OS has control over the CPU, it generates regular interrupts to return control to it (if a program got stuck in an infinite loop for example). It does this with a timer
- The instruction cache is used to hold the instructions waiting to be executed next
  - Without this, several CPU cycles would need to be spent retrieving cache instructions
- _Emulation_ - simulating computer hardware in software. E.g. if something was compiled for one architecture then attempted to run on another, an emulation layer would take in all of the instructions from the original compilation, translate them to the new architecture style, then run the program on the actual hardware
- **A processor can only access main memory directly**
  - Stuff in other memory locations must first be loaded into main memory
- When a program aborts a dumb of memory is taken and written to a log file on disk for possible debugging
- `strace` lists each system call as it is executed
- The `file` command will return metadata about a file
- Linux uses the `ELF` format for binary files
- `ABI's` (Application Binary Interface) specifies how binary code interfaces with the operating system
  - how to pass parameters to system calls, etc.
  - Programs are compiled to run on a specific ABI -> any system supporting that API can run the program
  - Typically each architecture will have its own ABI
- Microkernel - the philosophy where kernels are broken up into small pieces with a lot of functionality being brought into user space
  - The linux kernel is more monolithic (resides at one address space for quick communication)
    - It has a set of loadable modules that it loads in to extend the core kernel functionality at run time (`LKM's` Loadable kernel modules) e.g. some drivers, etc.
    - These are pretty easy to write and are a good way to interact with and write kernel code
      - `lsmod` lists all currently loaded kernel modules
      - `insmod` to add a module to the kernel
  - MacOS's darwin kernel uses the microkernel philosophy
- `vmlinuz` is the kernel image from the compiled kernel
  - This is a compressed image that is extracted after it is loaded into memory
- `vmstat` memory usage statistics
- `/proc` is a pseudo filesystem that allows you to query kernel statistics
  - each pid has its own directory with info in it
- `dmesg` contains kernel logs
- **program counter**: a CPU register indicating the main memory location of the next instruction to load and execute
  - Each process has its own program counter I think?
- *Monotonic clock* is the number of seconds elapsed since a fixed point of time
- *Wall clock* (e.g. `gettimeofday())` can jump due to NTP syncing

### Devices

- A general computer system has a bunch of device controllers connected through a common bus, giving access to shared memory, etc.
  - The device controllers (e.g. usb controller) has some local buffer storage and a set of special-purpose registers
- The "device" can be a keyboard, etc. The device controller transfers the data from the device to its local storage
- The device driver sits on top of the device controller, responding to interrupts generated from the device

### Processing

- SMP (symmetric multi-processing) when all cores execute the same type of instructions (e.g. all operating system functionality)
  - Processors share memory but each have their own registers/cache

### Clustering

- asymmetric clustering - one node is in hot-standby monitoring the other node and jumps in when needed
- symmetric clustering - all nodes run the application and monitor one another

## Linking Files

- C++, etc. source code is compiled into object files, linked to other object files, compiled into an executable, then loaded into memory with the loader, and dynamically linked to and dll's (dynamically linked libraries or so, shared object files on Unix systems) to be executed
  - dll's are specified in the compilation phase but are not actually linked in until runtime if they are needed
  - e.g. ./executable executes the loader to load executable into memory
