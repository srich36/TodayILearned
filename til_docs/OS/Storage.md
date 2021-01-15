## Overview

- To run a program, it must first be loaded into memory (e.g. RAM)
- Hard Dive (mechanical storage) vs SSD (electrical storage)
  - Memory is stored on a rotational platter that the head then seeks to to read/write
  - Electrical storage is generally faster and smaller
- Not volatile storage (NVS) - memory that retains its information after losing power (Hard drives, etc.)
- SSD (solid state drive) are faster than hard drives
  - Faster because they don't rotate to get to a point on memory, and thus have no seek time
  - More expensive than HDDs, but consume lest power
  - Surface mounted on computer motherboards and acts as the main storage for mobile devices and some laptops
    - My thinkpad has a HDD (`lsblk -o name, rota`)
- RAM drives - portions of RAM that are carved out as a block device and stored as a filesystem
  - `/tmp`, `/dev/ram` on linux
- PCI Bus (Peripheral Component Interface) - A data bus connecting hardware components on a computer
- A disk may have some *bad blocks* which are unusable. It keeps track of these *bad blocks* throughout its lifetime. Generally there are additional sectors that are logically replaced (what the OS sees) when these blocks go bad


## Device Connection

- These secondary storage systems are connected to the computer through an *I/O Bus*
  - These are SATA, USB, etc. 
  - Each device controller responds to commands to operate the hardware and carry out the commands, then sending the data back to the host

## Memory Scheduling

### Hard Drives

- It takes time to seek to and retrieve memory - we can reduce this latency with scheduling algorithms
  - Note: These only make sense for hard drives since the disk is physically spinning
  - Generally reads/writes in sequential order perform better on hard drives due to the lower seeking time
- Linux `deadline` scheduler
  - Implements a CSCAN algorithm (start at the start of the disk, process to one end, then immediately come back) and maintains separate read and write queues
- Each drive has a queue of operations. If it is busy, an IO request is appended to the queue

### NVM (Non Volatile Memory) Devices

- Devices without a spinning component use a FCFS policy since everything can be directly accessed

## Error Detection

- Naive/simple solution: Parity bit -> compute by taking XOR of all the bits
- Checksums are another form of parity -> can essentially a Hash of a file when protecting files
- Error correction codes
  - Hamming codes
  - Soft error -> an error that can be fixed
  - Hard error -> unrecoverable error (too many bits flipped)


## Initializing a Storage Device

- Stores devices are initially just a blank slate of semiconductors
- *Low level/physical formatting* - It must first be divided into sectors/pages that the controller can read or write to
  - Each page contains a header, data area, and trailer (header and trailer include sector/page number and error correction code)
  - **This happens at the factory**

#### Configuring the Drive for OS Use

- The OS must write it's own data structures to the device before it can use it
  - First, *Partitioning* - Breaks the device up into one or more groups of blocks or pages
  - Each partition can be treated as a separate device
- In Linux, if a drive is recognized, it's partition info is read, and separate entries for the partitions are created in the `/dev` directory
  - The `/etc/fstab` configuration file then tells the OS to mount each partition containing a filesystem at a given point (**mounting is just making the filesystem available to users** - I've heard a lot of definitions of mounting and think this is the simplest)
- Next, `volumes` are created from the partitions to be mounted (partitions are a logical device-specific thing, volumes are software)
- Lastly, *Logical formatting* - The creation of a file system. The OS stores file-system data structures on the device (e.g. maps of free and allocated memory as well as an empty directory)
- A bootable filesystem contains OS code (partition labeled for boot -> used to establish the root filesystem on which other devices are mounted in Linux)
- **Raw disk** Special programs can access a partition as a sequential sequence of logical blocks with *no* file system data structures -> this is raw disk (and uses raw I/O) and is used for swap space
  - Raw I/O bypasses all file system services like prefetching, filenames, directories, etc.
  - Some databases use raw IO because they can specify exactly where things are stored


## Bootstrapping

- Bootstrap program is stored in flash memory (essentially EEPROM)
- Generally the bootstrap loader (stored in flash memory) loads in a full bootstrap program into secondary storage
  - The bootstrap loader is grub for linux
  - The full bootstrap program is stored at a fix memory location - the bootstrap loader instructs the hardware to load the program into memory. The full program then loads the OS
- *MBR* (Master Boot Record) - Where bootstrap code is stored