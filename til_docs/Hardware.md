# Hardware

- Pg. 185ish-238 gives the full detail in how a computer is built
- The process of programming computers with punch cards was because previously putting instructions in memory was unfathomable - there was barely any memory available
- `NOOP` an instruction for the processor to perform no operations
- Different chips communicate with each other through a bus, which provides signals to every board
  - This bus also provides power to the different chips
    - E.g. PCI is a type of bus
- EEPROM
  - ROM - Read only memory
  - PROM - Programmable read only memory (only programmable once)
  - EPROM - Erasable programmable read only memory (erase with UV light)
  - EEPROM - Electrically Erasable read only memory (erase with software)

## RAM

- Random Acccess Memory - Called random because you can read/write to any address without going sequentially
  - Can be implemented with a decoder, set of flip-flops, and a selector
    - The selector selects the memory address...e.g. with 10 inputs it can store 1024 different addressable values
- RAM is also volatile - it requires constantly powered transistors to be in their switch states to store the bits of information. If the switches lose power memory is lost!
  - It will start up again with random memory values
- Dyanmic RAM requires refresh cycles to avoid losing its contents, static RAM does not
  - DRAM is cheaper and easier to build and is thus what is predominant

## Opcodes

- Operation codes (`opcodes`) are encoding bytes that tell the computer what operation to perform.
  - These come with memory addresses indicating the address of the data the operation is to be performed on
- "Instruction fetch" - retrieving these opcodes from memory
- `Jump` instruction - tells the computer to start executing instructions at a different memory address
- Opcodes are just the software you write to tell the hardware what to do (machine code, assembly is translated into this)
  - Each instruction in assembly is translated directly into bytes
  - For example, `MOV` will translate directly into a hexidecimal opcode
  - `MOV` can just be thought of a friendly name for the opcode
    - `MOV` can have multiple opcodes associated with it though, as each opcode represents the different parameters it can be called with (e.g. move into register B, C, D, etc.)
      - The 8080 microprocessor has 63 opcodes for move
- `MOV1 [destination_address], [source_address]`
  - Opcodes can specify a src and destination address for their operations

## Latches

- A "latch" is just a flip-flop that holds on to, or latches on to a value when the write bit is not 1
- A latch used to accumulate a running total of numbers is an accumulator

## Clocks

- A clock signal is just made up of a series of frequency halving circuits. These circuits switch state between 0 and 1 indefinitely because of how they are wired
- Thus, the highest frequency osciallator switches the least significant bit between 0 and 1. The next highest frequency toggles the next least significant bit between 0 and 1 at a rate half as fast as the least signficant bit. This ensures the lease significant bit toggles between 0 and 1 before the next bit switches from a 0 to a 1
- You can chain as many of these together as you need (one for each bit of the counter/clock you want to build)
- This will count indefinitely
- Instructions can require multiple clock cycles

## Caches

- LRU (least recently used) - Cache eviction algorithm for determining which bytes to throw out of the cache to make room for new the incoming results

## Stack

- The general hardware stack just provides memory where a program can push things onto and pop them off instead of storing memory in a certain address and having to remember where it is stored
  - With a stack, a program just needs to know the order things should be pushed on or off the stack and it will get the data/addresses it needs
- The stack is just a section of normal RAM that isn't used for anything else
- The *stack pointer* is just a register that points to the address of the top of the stack (when you add something to the stack the computer needs to keep track of where the stack currently is to add the next bit of data/pop off the result)
  - e.g. if the top of the stack has data at *0xffh* the *stack pointer* will point to *0xffh*
- Stack overflow: when too many items are pushed onto the stack that the stack gets too big and overflows into overwrite other memory needed by programs
- Stack underflow: when the contents of the stack get exhausted prematurely
- Generally, the stack pointer is initially set to *0x000* so the first push onto the stack is pushed on at the last memory address (e.g. *0xfff*)
  - Successive stack pushes push on to *0xffh*, etc. and decrement the stack pointer 

## Program Counter

- A register the processor uses to retrieve the address of the instructions to execute
- The `CALL` instruction pushes the current address onto the stack, then loads a new address into the program counter for execution
  - This is how functions are implemented, a `CALL` instruction pushes the current instruction address onto the stack, loads a new address into the program counter, and when the function returns it pops the address of of the stack to be reloaded into the program counter and continue where it left off
  - The `CALL` instruction is essentially a reminder to the program of where it jumped from
  - You pop off the `CALL` instruction and load the results into the program counter with the `RETURN` instruction
  - Functions are called subroutines in assembly

## Multiplication

- Uses one address for a result, one for the multiplier, one for the multiplicand
- Loops through, adding the multiplicand to the result, and decrementing the multiplier (counter of how many times the mulitiplicand has been added to the result)
- Once the multiplier is decremented to 0 (the program has added the value the proper amount of times to itself) the program no longer jumps to the start of the zoom because of th `JNZ` (jump if not zero) opcode

## Input/Output Devices

- To a processor, input/output devices provide addressable memory the processor can read/write to 
- Input/output devices can provide interrupts with an interrupt signal attached to the microprocessor

## Instruction Sets

- Instruction sets differ between chips - this is why one compiled program (which translates to instruction sets/opcodes) cannot be run on different architectures
- **Note:** the instructions covered here are `CISC` (complex instruction set) computing, while `RISC` (Reduced instruction set) e.g. from ARM, generally limits the instruction set to load and store instructions

#### Emulators

- An emulator examines opcodes one by one, essentially translating them, and performing a certain action to convert one instruction set to another for a different chip

## Big/Little Endian

- In an instruction that lasts 3 bytes, the first byte will be the opcode then the next two bytes be the 16 bit address to operate on
- When storing 16 bit addresses in 8 bit blocks of memory Intel stores the low order byte first, then the high order byte. Motorolla does/did the opposite
- Thus, knowing the correct address is dependent on the ordering of these high and low order bytes
- Low-order first (Intel) is deemed `litte-endian` and high-order first (Motorolla) is deemed `big-endian`

## Interrupts

- When an interrupt occurs, the chip sends a signal to the process to save the current program counter and branch to a certain address to run a program specified by the interrupt
- A keyboard for example is just a set of switches. When a key is pressed the switch is closed, and the keyboard hardware generates a code for the key that was pressed. 
- maskable interrupts -> can be turned off by the CPU prior to executing important instructions
- nonmaskable interrupt -> reserved for unrecoverable memory errors or divide by 0, etc.
- At boot time, an OS will installs the existing devices' interrupt service routines into the interrupt vector
- traps are *software interrupts* and are used to request kernel space execution of programs from user space applications
- The alternative to interrupts is frequent polling which may only be better in high throughput devices

## Bandwidth

- Refers to the amount of information that can be transferred over a medium

## Video Adapter

- Signal of voltages indicate pixels
- Video adapter must have RAM to store values and processor must be able to write into it

## Initialization

- Upon loading, the computer executes initialization code in its starting memory address
    - This can configure the stack, enable interrupts, etc.
- Normally, the OS is stored on the first part of the disk and loaded into memory on boot
  - The bootloaded loads this. The bootloaded will load the initially code into memory, and that loaded code will be responsible for loading the rest of the OS.

## Files

- Blocks of memory are allocated to describing where files are stored (this is what a directory is)
  - They are not necessarily stored consecutively
  - You can store filename, last updated time, size, file location, etc. 
    - This is the file system

## Executables

- When you type in the name of an executable, the OS searches for a file with that name, loads it into memory, then begins processing its instructions

## Decimals

- Fixed point: uses a given number of bytes to store the values, with 4 bits each for each decimal place (since numbers can range from 0-9)
- Floating point: stores numbers in scientific notation in binary
  - Single precision: 1 bit sign, 8 bit exponent, 23 bit for the mantissa
  - Double precision: 1 bit sign, 11 bit exponent, 52 bit mantissa


## Computer Graphics

- Vector graphics: create images algorithmically with lines, curves, and shapes
- bitmap graphics - encode bits to certain values corresponding to pixelss for displaying the image
  - GIF's - reversible compression for Bitmaps
  - JPEG - lossy (some data is lost) compression for Bitmaps
- Videos are just quick displays of still images (frames)
  - These are just stored as a series of bitmaps with sound. Yeah, a lot of data (since it is essentially one image per frame)
    - Thus, major compression techniques need to be employed

## Sound

- Sound is analog, so an Analog-to-Digital converter (ADC) translates the waves to bits indicating the sound intensity
- The sound waves are sampled at a given sampling rate to be converted to the bits representing them
- A Digital-to-Analog converter (DAC) can be used to play sound
- Lower sampling rates thus produce lower fidelity sound as more information is lost in the conversion from analog to digital

## Modems

- Convert sound waves to bits
- Transmitting information through light is much faster and is what is used now