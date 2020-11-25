# Overview

- At startup, the computer runs a bootstrap program which then loads the OS into memory
- Uses EEPROM (electrically erasable programmable read-only memory) or similar schemes to store the bootstrap program since RAM is volatile
- Generally this program is simple and stored in firmware. It must know how to locate the OS and start executing it
  - Once the kernel loads it will start providing services (e.g. Linux starts systemd which starts a bunch of other services)
- `GRUB` is a bootstrap program for linux
- Kernel parameters for bootstrapping can be found in `/proc/cmdline`
  - `root` is the root file system identifier
- `systemd` is the first process on the system


## Boot Process

- 1. The bootloader locates the kernel
- 2. The file containing the kernel is loaded into memory and started
- 3. The kernel initializes the hardware
- 4. The root file system is mounted