# General

- Virtualization abstracts hardware into different execution environments
- Completely isolated from the host. Good: Protects against viruses. Bad: can't share resources well
- The *Open Virtual Machine Format (OVF)* defines a format for a VM that will run on any VMM that supports
the protocol. This is like OCI images
- In Type 2 hypervisors, the "disk" each guest manages is really just a file on the host OS
    - To copy the guest we can just copy that file

## Layers

- The *host* is the host machine running the virtual machine
- The *VMM* (Virtual Machine Manager) (a.k.a *Hypervisor*) creates and runs virtual machines by providing an interface
that is identical to the host
  - Each *guest* process is provided with a virtual copy of the host (usually each guest is an OS)
  - Thus, the VMM imitates the host, so when the *guests* think they are talking to the host, they are actually talking
  to the VMM (it sits above the host hardware)

### VMM Implementation

- *Hardware based* (found in mainframes) -> called *type 0 hypervisors*
- *Software based* (e.g. VMWare ESX) -> called *type 1 hypervisors*
- Applications that run on normal OS's but provide vmm functionality -> *type 2*
- Allow snapshots to be made of the *guest*
- Some VMMs provide a *live migration* feature that allows for migrating a VM from one host to another without interruption
    - Good for balancing load dynamically, repairing hardware, etc.

## Cloud Computing

- Most cloud infrastructure is built with VMs on bare metal
    - Customers can then deploy containers onto these VMs

## Virtual Machine Implementation (Building Blocks)

- Virtual CPUs (VCPU) does not execute code, but represents the state of the guest "CPU" (even though this doesn't actually exist)
    - This is done so when a VM process is context switched onto a real CPU, the VCPU can load its context information, etc.
    (essentially performing the work of a process control block (PCB))
- Since VMMs run in user-space, they cannot execute kernel level code. However, they emulate a user-space and kernel-space 
environment (both running in user space). When the kernel-space environment tries to make a syscall, it is trapped to the VMM.
The VMM then executes then actually executes this syscall on the host on behalf of the guest and then returns control to the
guest -> *trap and emulate*
  - Because of this, priveleged instructions are slower (as opposed to non-privileged instructions which run natively
  on hardware)
- *Binary Translation* - up until 1998 x86 CPUs had no clear differentiator between privileged and unprivileged instructions.
Thus, if the VCPU were in kernel mode, it would watch for privileged instructions, and then translate them into binary
instructions that were fully privileged to run on the native hardware
  - VMWare sped this up greatly with caches
  - VT-x instructions (virutalization support) were added in 2005 to x86 hardware -> all major CPUs now provide virutalization
  support
- With hardware support, you can easily build OS frameworks for thing hypervisors (e.g. MacOS `hypervisor.framwork`)

## Virtual Machine Lifecycle

- At the time of VM creation, the hypervisor assigns the VM parameters (number of CPUs, amount of memory, networking 
details, storage details, etc.)
- When a VM is deleted any disk space is freed up and the VM configuration is removed
- To share things like I/O devices between VMs there is a *control partition* which the VMM then routes requests to.

## Type 1 Hypervisors

- Standard type of hypervisor in datacenters - OS'es that run natively on hardware and manage the creation of other 
VMs (e.g. VMWare ESX)
  - Guests don't know they are running on anything but native hardware
- Can pack more OS'es on one machine and get better utilization
- Type 2 Hypervisors run on standard operating systems (i.e. run on Mac, Linux, etc.) and thus provide fewer virtualization
features but are easier to use, test out, and get started with

## Programming Environment Virtualization

- e.g. JVM
  - Programming languages have to run in this virtual env
  - The JVM provides APIs that interact with the hardware, and Java code interacts with the JVM provided APIs. The JVM
  is compiled onto the target hardware, and Java programs run inside of it

## CPU Scheduling

- The VMM can provide mulitple vCPUs to a guest, and then schedules those vCPUs on actual cpus
  - Guests receive only a portion of the CPU cycles, even though they believe they are receiving all of it

## Memory Management

- Guests are often configured with more memory than the system has. The VMM must present a fixed size of memory to the
guest (as those OS'es expect fixed memory) then figure out how much real memory to allocate to each guest
  - Each guest believes they are maintaining their own page table, but really the VMM maintains a nested page table that
  maps the guest page table to the host page table
- If guests share the exact same pages (2 guests running the same OS pages, one page can just point to another)

## IO

- The VMM provides a device driver to each guest which then maps requests to host IO, etc.
  - Sometimes a guest will bypass the driver and be given exclusive access to an IO device

## Booting

- A *disk image* of each guest root disk is stored on VMM filesystem

## Live Migration -> Really cool and important

- VMMs can implement, but normal OS'es cannot
- Guest on one system is copied/moved to another machine without any downtime (network connections continue, etc.)

Process:
1. Source VMM contacts target VMM and establishes it's allowed to migrate the guest
2. Target VMM creates a new guest with vCPUs and nested page table, etc.
3. Source sends all read-only memory pages to target
4. Source sends clean read-write pages to target
5. Pages modified during 4 are re-sent
6. When 4-5 cycle is short, VMM freezes guest, sends final VCPU state, final dirty pages, and tells target to start
running the guest
7. Once target acknowledges guest is running, source shuts down

- This requires a network that understands a MAC address can move in an existing connection
- Live migration can be used to automatically balance load between VMMs, etc.
