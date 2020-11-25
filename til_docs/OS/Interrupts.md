## Overview

- Sent through the system bus (the main communication path between major components)
- Upon receiving an interrupt, the CPU immediately pauses execution and starts execution at a fixed location
  - This is likely an interrupt service routine
  - An **interrupt vector** is an array of low address memory that maps pointers from the interrupt time to the interrupt service routine address for execution
- Interrupts allow the OS to respond asynchronously to events
- Modern OS's may not respond immediately depending on interrupt priority
  - 2 interrupt lines: one for critical code and one that can be turned off when the CPU is executing important instructions

## How Interrupts Work

- The hardware has an **interrupt-request line** that is sensed after every CPU instruction
  - If there is a signal, it uses the value to index into the interrupt vector and run the interrupt service routine

## Software Interrupts

- Exceptions trigger software interrupts