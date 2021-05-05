# General

- The kernel does not care about the data format when writing to and reading from files 
  - A binary file is the same as a text file

## eBPF (extended Berkeley Packet Filter)

- *eBPF* is an extension of *BPF* which is a small VM that injects eBPF code (byte code written in the eBPF language,
a subset of C) into kernel hooks
  - Can think of these hooks like JavaScript proxies -> e.g. every time this specific syscall (one example of a hook) 
  runs call my custom eBPF function
  - Other hooks: function entry/exit, kernel tracepoints, network events, etc.
    - **This is how you can instrument the kernel for observability without modifiying code**
      - Many of the newer observability products use this (e.g. can use eBPF to make sense of kubernettes)
    - Can create custom kernel probes (kprobe) or user-space probes (uprobe) to attach hooks to -> can basically attach
      to anywhere
  - Fundamentally eBPF programs are **event driven** (e.g. run on call to hook)
- Like kernel modules but more secure -> code is sandboxed (eBPF code cannot damage the kernel, and it goes through
a validator to ensure nothing bad can happen)
