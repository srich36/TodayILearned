## Encryption

- *Symmetric Encryption* - You first encrypt a message with a key. That key can then decrypt the message
- *Asymmetric Encryption* - One key encrypts a message and **only** the other key can decrypt it. This flows both ways

### Public-Private Key Encryption

- Can encrypt with a public key and decrypt with the private or vice-versa

### TLS

- Uses public private key encryption (asymmetric) to establish a handshake
- Once the handshake is established, the client/server agree on a **session key** which is symmetric