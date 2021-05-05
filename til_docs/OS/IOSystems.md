# General

- *blocking IO* is IO that suspends the program and puts it on a wait queue until the IO is completed
- *non blocking IO* does not suspend the thread and keeps the program running (not placing it into a wait queue to
- execute another process)
- *vectored IO* - multiple reads/writes to different buffers in one system call
- A *buffer* is a set of memory used for storing data being transfered between two devices
  - Data is written to a buffer as all the data is waiting to come in, and thus can be transferred all in one operation
  - This also allows for size discrepancies between hosts -> TCP packets are buffered then reconstructed to be 
    non-fragmented on the receiving host
- *Spools* are buffers that collect output for devices that can only accept one data source at a time (e.g. a printer)
  - The OS collects these spools into pages and then sends the entire page over to the printer when it is done with 
    the previous one
    - This is how you can see/cancel printer job -> you are removing it from the spool  
- IO calls are all kernel space
- Unix provides file system access to files, devices, process address space, etc. all with the `read` call
- At boot the kernel analyzes all hardware buses to find attached devices and loads their drivers
  - Devices can be loaded dynamically as well
- IO is a major factor in system performance


# Drivers

- `Device Drivers` are pieces of kernel software that expose device-specific functionality to the OS through a standard API
  - This way, the OS doesn't need to know how to interact with every single device, it can just call the standard driver interface
    - e.g. a mouse driver implementing a `file_operations` struct that implements standard methods like `open`, `release`, `read`, and `poll`

# Devices

- Devices communicate with the computer through a `port`, e.g. a serial port
- Devices that share wires are on a connection called a bus (*PCIe* bus is the common system bus - connects processor/memory to fast devices, while an *expansion* bus connects slow devices like keyboards, usb ports, etc.)
  - PCIe buses are split into multiple lanes which allow for full-duplex (bidirectional) data transfer between the two ends
  - Daisy chains usually operate as a bus

## Device Controller

- A device *controller* is the electronics that can operate the device. The driver speaks with the controller.
  - e.g. a serial controller is a single chip controlling the electrical signals to and from the serial port
  - The communication goes OS->driver->device controller->electrical signals sent to actual device
- Device controllers have a set of registers for data and controller signals. The driver reads and writes data to and from these registers to communicate with the controller
  - e.g. status, data in, data out, control
- Devices that support memory mapping (*mmap*) map their registers into the processor's address space so the processor can read and write to their mapped location in physically memory (e.g. an innterupt controller devices can be mmapped to hex address 0x021-0x021)
  - Today, most I/O is performed by device controllers with memory mapped I/O
- The controller will set a busy bit when it is working. When free, and if there is a command from the processor available, it will read the data and send it to the device
  - When the device becomes available it will send an interrupt
    - There are thousands of interrupts being processed per second
- For larger transfers, instead of continually writing to the data register and waiting for the controller to service it, a *Direct Memory Access (DMA)* controller is used
  - You pass in a pointer to the start of the source data, a pointer to the destination buffer, and the number of bytes to transfer and it takes care of it for you without the processor needed to continue to do work on the transfer
  - The DMA controller is a processor that operates the device controller independently (without the processor). The device controller still sends the actual signals to the device


## Application IO interfaces

- The OS abstracts away IO device into a set of different kinds
  - each kind has its own interface (e.g. keyboard, mouse, etc.)
  - The driver implements this interface and speaks to the device controller
  - This is a level below the standard IO syscall interface that the IO subsystem implements

### Device Types

#### Block Devices

- Must support `read`, `write`, `seek`, etc.
  - Typically accessed through a file system interface
- *raw io* is accessing the io device directly with no file system/OS intervention
- *direct io* is acessing the device with only no buffering and no locking

#### Character streams

- 1 char at a time
  - support `get()`, `put()`


#### Network devices

- `sockets` are a network interface


## IO Scheduling

- Each device maintains its own wait queue
 - Higher priority processes may preempt, or reads optimized for HDD head traversal

## Interacting With Hardware

- When reading a filename, this gets mapped to an *inode* which contains information about the space on a disk
  where a file resides
- To get the corresponing device, Linux looks up the filename previx in a mount table
  - this device also exists in the filesystem namespace, and gives the kernel info on what driver to use

