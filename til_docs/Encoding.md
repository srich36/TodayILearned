## Encoding

Encoding is just a way of representing one thing with something else. Since computers can only store 0's and 1's for example, characters must be _encoded_ to 0's and 1's to be displayed.

## Encoding Types

### ASCII

An 8-bit encoding scheme which represents 127 distinct characters. These are mostly the English letters/special characters. Cannot support more than 256 different combinations since it only uses 1 byte.

### Unicode

Attempts to build one encoding scheme for _all_ characters. There are over 1 million different characters represented in unicode.

Unicode is not actually an encoding. It is just a map from characters to code points. But encodings such as `utf-8`, `UTF-16`, and `UTF-32`.

Four bits are needed for the proper encoding of all potential unicode values (2^32) but this would waste a lot of space for the most common letters.

Thus, `UTF-8` and `UTF-16` were developed as variable-length encodings to address this problem. `UTF-16` is **not** ascii compatible and thus can screw things up when a parser, etc. expects ascii compatible encodings.

Characters in unicode are referred to by their _unicode code points_ which are represented in hexidecemal prefaced by `U+`.

e.g. `U+1E001`

Note:

- If your text is messed up when reading a document the program you are using is likely using the wrong encoding.
- The `�` character seen so often is called the _unicode replacement character_ and is used to indicate a program couldn't decode a character correctly when using unicode
- UTF-8 is binary compatible with ASCII
  - ASCII characters have the same 1 byte values in UTF-8
- When something "natively supports Unicode" all that means is it does not directly assume that 1 byte = 1 character
- In general, `UTF-8` is the de-facto standard for everything these days

**Since unicode can represent all characters you should always be using a unicode-based encoding**

#### UTF-16

- All JavaScript supports is `UTF-16` encoded strings. These are input strings, not necessarily the source code. Source code is recommended to be encoded in `UTF-8`.

### Base64

- `Base64` is a binary to binary (or text) encoding -> a way in which to translate arbitrary binary data into printable ascii characters/the binary for them.
- Generally things are encoded to base64 before being sent over HTTP requests
- This encodes **any** data to ASCII to be used as printable characters.
- This is necessary when you are transmitting data over mediums that only can deal with printable characters
- `Base64` ensures that the data remains intact throughout transport
- When data is transported, you cannot be sure that it will be interpreted correctly on the other end. `Base64` encoding gives a standard for properly ensuring all data is received and not incorrectly handled since all the transported text is ASCII.
- 3 consecutive bytes (24 bits) are encoded as 4 6-bit values (24 bits)
  - This is why base64 is 4/3 times longer than a normal string
  - Each six bit value then corresponds to an ASCII character
  - This is literally all base64 encoding is
- Primarily used for systems that can only handle ASCII characters and just ensures it won't get corrupted
- Sending data as UTF-8 may corrupt it on the target system. That is why `Base64` is used

The process for safely transporting text is thus as follows:

Sender:

1. Encode text string in encoding of choice (e.g. `UTF-8`) to turn the text into bits
2. `Base64` encode the bit string and send it to the other computer

Receiver:

1. `Base64` decode string into bits.
2. Knowing which text-encoding was used (e.g. `UTF-8`) you can now process the bit string properly.
