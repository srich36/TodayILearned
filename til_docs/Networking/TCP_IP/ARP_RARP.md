## ARP (Address Resolution Protocol)

ARP is the protocol used to translate an IP address to a physical hardware (MAC) address. To do this, the questioning machine sends out a broadcast frame to every device on the network with the IP address in question, asking for the hardware address corresponding to the given IP address. The device with the given IP address then responds with its hardware address.

These hardware addresses are needed because the link layer works with hardware addresses and knows nothing about the IP protocol. Thus, the sending of frames uses the hardware addresses between machines. ARP results are cached and can be viewed with `arp -a`.

## RARP (Reverse Address Resolution Protocol)

RARP is used less and is a way to map hardware addresses to IP addresses. This can be used when bootstrapping a system, when the system does not yet know its IP address. It will send out a frame to devices on the network asking for the IP address corresponding to its hardware address.