# IP Fragmentation

- IP fragmentation (splitting up a stream of data into multiple IP packets) occurs at the IP layer and thus is transparent to TCP/UDP
- However, in order to reduce bugs, TCP generally doesn't send packets to the IP layer requiring fragmentation, handling the breaking up of the packets itself instead
- Datagram: A datagram is the entire unit of end-to-end transmission sent
- Packet: The data (potentially fragmented) that is actually sent