## General

- bit just comes from "binary digit"
- UPC's are just encoded in bits with the bars
- Parity: even parity if even number of 1's and odd parity if od number

## 0x

- Why hexadecimal? In hexidecimal, a multi-byte number is represented as the combination of the bights that comprise it
  - Each byte can be divided into an equal number of bits (2 sets of 4 bits)

## Boolean algebra

- OR and AND correspond to union and intersection
- `+` (or `^`) corresponds to union, and `x` (or `downcaret`) to intersection
- `NOT` corresponds to 1 - something

### Representing this in a circuit

This is actually quite intuitive. Pg. 100-101 of *Code: The Hidden Language of Computer Hardware and Software* is probably the best visualization I have seen of this

- switches in series - AND
- switches in parallel - OR
- You can combine these to produce complex logic gates. For example, each OR of the condition is a separate path of the circuitry where if fulfilled, current will flow through. AND's as well. These electrical switches - relays - are the building blocks of circuits. Connecting them allows you to build these gates.
- Thus, if you can simplify the expression designing the logic gate, you can simplify the circuit needed to model it.

### Logic Gates

#### Core building blocks 

These are all intuitive - take some time to think about it

- AND: 2 relays in series - AND gate
- OR: 2 relays in parallel - OR gate
- NOT: A relay where the circuit is connected when the switch is in the off state - called an inverter - used for NOT's. Input != output
  - Inverts voltage to no voltage and vice versa
- NOR: 2 relays wired in series with circuit connected in off position
- NAND: 2 relays wire in parallel with circuit connected in off position
- BUFFER: single relay that connects the circuit when it is on. Input = output
  - can delay or amplify signals

#### Other Gates

- XOR: Combination of OR and NAND