# ICMP (Internet Control Message Protocol)

ICMP provides a protocol for systems to pass messages between one another using IP, even avoiding the TCP/UDP transport layer. `ping` uses ICMP echo request and response messages to check connectivity between systems without the transport layer.

The ping server - what replies with ICMP echo responses - is usually implemented within the kernel.
