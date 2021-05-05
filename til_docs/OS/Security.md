# General

- Malware is just code written by one user that is executed by another user (with the other user's permissions)
- Spyware just downloads ads/opens popups on a user's system. Could also contact a server for a list of email addresses,
etc. and send an email to all of those users
- *Privilege escalation* is just a fact of life. Multi-user Unix systems are being abandonded more and more now. `sudo`
essentially does nothing (if a process doesn't have `sudo` its relatively easy to find a privilege escalation exploit).
It just helps prevent human errors
- `IPSec` defines a format for adding authenticators and encryption in IP packets themselves, and is used in VPNs
- One time passwords are a combination of 1. a user generated code and 2. a system generated code
  - The system knows 1 and 2 and thus can compute a function of 1 and the other. The user will then input the code generated (e.g. google authenticator code, this same computation performed, and the result checked)
- Firewalls sit in front of a computer and limit the traffic that can go through to it (based on ports, 
source/destinaton IP addresses, etc.)
- *Demilitarized zones* (DMZs) are semi-trusted networks
  - Connection allowed from internal computers to internet but not vice versa. Connection allowed from internet to 
  DMZ but not DMZ to internal computers
- *ASLR* (Address Space Layout Randomization) randomizes the location of the stack/heap so attackers cannot pinpoint 
the location of programs, buffers, etc. for exploits
  - This is a standard feature in modern OS'es
- Mobile OS'es break the system files and user data into two different partions
  - System files are mounted read-only -> thus a lot more secure

## Buffer Overflows

- If tiny, may not overflow past the architecture specific padding to 8 and 16 bits -> no effect
- If a little bit over, will rewrite the next automatic variable
- If a lot over, will rewrite the whole current function stack frame
    - Since the top of that stack is the function return address (where program execution will return to), an attacker
    can overwrite the buffer and put a malicious address there
      - If you write *shellcode* (code that spawns a shell, and load this in through a variable and overwrite the
      return address to that location, you can gain access to the system)

## Encryption

- *Ciphertexts* are the encrypted message
- Encryption types:
  - Symmetric: Same key can encrypt and decrypt
      - AES
  - Asymmetric: Different keys must encrypt and decrypt (e.g. encrypt with private key, decrypt with public)
      - RSA
      - Asymmetric encryption is *much* more computationally intensive



## Intrusion Detection

- If an intruder is detected, a sophisticated attack will direct them to a *honeypot*, a fake 
resource that's used to get more information about an attacker
- A simple intrusion detection algorithm is scanning network packets for `/etc/passwd`, or virus detection software 
scanning binaries/packets for known viruses
- *Anamoly Detection* is the process of watching system operation and reporting anything that significantly deviates
from the norm
  - Can find *zero-day* attacks (those not known before) whereas signature based protection detects known attacks
- Antivirus software scans binaries for known viruses, removing them if they find them
    - More sophisticated versions look for families of patterns
    - Some intially run programs in sandboxes to test them before letting them run unmonitored


# Protection

- *Principle of least privilege* - programs should only have the maximum number of permissions required to accomplish 
their tasks
- In Unix there is a *setuid* bit that can be set on files. If set, whenever that file is executed, anyone who executes
the file gains the permissions of the owner
  - Generally bad practice to write setuid programs, passwd is setuid (this will appear as an *s* instead of an *x* in the file permissions)
- Role based Access Control (RBAC) - where a process takes on a "role" that can only do certain tasks to accomplish the
principle of least privilege
  - Users can also be assigned roles too
- `Mandatory Access Control` (MAC) is a system policy that not even the root user can modify without a reboot. Used for
stricter protections, used in SELinux
- OS'es typically have protection rings which has increasing permissions. ARM's most permissive is the *TrustZone* and is callable only from the kernel

## Linux Capabilities

- Linux has a capability system where a bitmask determines the capabilities a given process has 
    - A process/thread usually starts off with full capabilities and voluntarily gives them up as it goes along. These cannot be reacquired
      - (e.g. capabilility to open a network port)
- A bitmap keeps track of which of these capabilities are allowed 
- `Darwin` uses entitlements (declaritive permissions) - apple specific ones are com.apple.com, etc.


## Sandboxing

- When sandboxing a process, tight restrictions are placed during its creation phase (before fork)
    - Can also include MAC, BPF filtering of system calls, etc.
