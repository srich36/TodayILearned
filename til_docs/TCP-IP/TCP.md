# Overview

- TCP is a connection oriented protocol
- Data is broken up into TCP _segments_
- If each segment isn't received by a certain time (and acknowledged), the segment is retransmitted
- Segments are transmitted as IP datagrams and thus can come out of order. The receiving application then resequences
- TCP provides flow control
  - Buffers for data, exponential backoff, etc.
- TCP is a stream of bytes and it does not care what format the data is in (e.g. binary, ascii, etc.)
- A `socket` is a combination of an IP address and port number
- _window size_: The number of bytes each end of the TCP connection is willing to receive in its buffer
- Data is optional -> TCP segments to establish connections, etc. send no
- Generally, TCP delays ACK's up to 200ms to see if it can send data with it
- You can ack multiple segments of bytes at one time
  - TCP sliding window
  - Recall, the receiver advertises a window size in every packet indicating how much data it has left available in its buffer
  - This window size is the size of the send/receive buffer
  - A receiver can ACK bytes but still not free up the bytes in the window size (because the application did not yet read them)
  - Max window size: 65535 bytes
- Urgent mode flag set -> process this data directly (e.g. keyboard interrupt)
- TCP generates an immediate ACK indicating the last received byte of data + 1 when data arrives out of order
- When speeds get up in the gigabit range the constraint is latency - getting from one host to another - rather than the rate at which an interface can send data
- When a server is listening on `0.0.0.0` this means that it is listening on **ALL INTERFACES** that the machine has for receiving packets
- Remote login protocols (ssh, etc.) use TCP
  - Everything typed by the user is sent to the server, and everything sent from the server to the client is displayed on the terminal
- CR/LF newlines
    - Carriage Return/Line Feed (\r\n)
- In remote connections everything the user type has to be echoed for it to appear
- When adding features to protocols they are normally added in a backwards-compatible manner
  - The client and the server do option negotiation to find out which options (e.g. additional commands) both support
- HTTP requests operate over TCP

##### TCP Header

- Each segment has a 32 bit sequence number, and a 32-bit acknowledgement number
  - Sequence number corresponds to the first byte in the data that the segment contains
  - Since it is 2-way communication, each end (transmitting and receiving) has its own sequence number
- Additionally each segment has a 16 bit source and 16 bit destination header
  - These, in combination with the IP Address appended on within the IP header, unique identify a connection
- The acknowledgement field indicates the next sequence number the receiving application hopes to receive

###### Header Flags

- `SYN` synchronize sequence numbers
- `ACK` the acknowledgement is number is valid
- `RST` reset the connection
  - TCP reset attacks - I believe this requires it to be on the exact right sequence byte
- `FIN` the sender is done transmitting data

## TCP Connections

Establishing a connection:

1. client sends a packet containing the port number of the server the client wants to connect to and the client's initial sequence number (ISN) (SYN packet)
2. The server responds with a SYN packet with the server's initial sequence number, and an ACK for the client's SYN
3. The client ACK's this response from the server and the connection is established

This is the "three-way handshake"

- A FIN packet closes the connection. 4 packets are required to close both ends (FIN/ACK packets in both directions).
- When a connection is established each end announces its Maximum Segment Size (MSS) -> the largest chunk of data each end can receive
  - This can be up to the interface's maximum transmission unit (MTU) minus the length of the fixed TCP/IP headers
  - This can ensure that IP fragmentation is avoided
  - Recall that MTU is the largest chunk of data that can be sent on the network/link layer within one transaction
- Clients typically use ephemeral ports. Servers use well-known ports
- Generally, whenever a new TCP request comes in to a server, it will fork the process to establish the new connection
  - The server can have many processes listening on the same well-known port number as long as the client process is different
  - There will always be a process listening for requests (see netstat LISTEN state values with \* as foreign address as it awaits new connections)
  - **TCP demultiplexes incoming requests (sends them to the right place) by the four defining values: source IP address, source port, destination IP address, destination port**

### Retransmissions

- Packets are exponentially backed off when retransmitting due to packet lost/timeouts
  - This is handled by a TCP timer

### Resets

- Can abort a connection by sending a Reset
  - The receiver does not acknowledge it at all, just aborts the connection
  - Can be used in TCP reset attacks
    - If I remember correctly, the SYN has to be the exact correct number for the rest to occur to try and reduce this

## Concurrent Connections

- TCP forks a new process for every connection but the OS may be busy and a new connection may come in before the fork is complete
- Thus, TCP maintains a connection backlog and ignores any SYN packets that come in when it is full (forcing packet retransmission after a delay in hopes that the backlog is emptied by then)
- This is all done by the TCP module in the Kernel, the application won't see these connections until they are ready to be dequeued (after the 3 way handshake)

## Bulk vs. Interactive Data

- Bulk data is data sent normally (any packets of info)
- Interactive data is stuff sent over remote shells, etc.
  - Each keystroke generally generates a data packet

## Congestion Window

- This is a slow start algorithm as to not overwhelm the network (start at one segment, slowly build up)
  - It is flow control received by the sender -> every time an ACK is received the sender ups the congestion window by one segment
    - "Only put out as many segments as there are ACK's" -> philosophy for this algorithm

#### Congestion

- Can occur when data arrives from a fast medium and piles up at a slower pipe
- Because of how the congestion window works (only send out a new segment when an ACK is received when the application is at steady-state), data will flow at the rate of the lowest path speed between two entities
- For the fastest transfer possible we want to keep the pipe full (max utilization, packets always being ACKed and new packets sent)

#### Congestion Avoidance

- 2 signs: timeout, and receipt of 3 duplicate ACKs
- Exponential backoff with congestion window size - the sender only sends up to the minimum of the congestion window size (sender variable `cwnd` and the receiver's advertised window)
  - Halved every timeout
  - Increased very gradually on successful transmissions

## Speed Limitations

- There are two main limitations when transferring data:
  - 1. Propagation delay
    - Delay in moving data long distances, latencies in transmission equipment
  - 2. Interface/Media bandwidth/data transmission limits:
    - e.g. 9600 bytes/s vs a gigabit per second connection

## Timeout and Retransmission

- There are multiple timers TCP keeps track of, including a retransmission, and keepalive timer
- The retransmission timer grows exponentially (generally doubled) with each retransmission
  - This is exponential backoff
- TCP essentially uses round trip time (RTT) standard deviation and averages to set the initial timeout time

#### Persist Timer

- The sender keeps a persist timer to continually query the receiver for the window size (in case ACKs advertising the window size are lost)
  - Only runs/is initialized when the window size is 0
    - TCP never stops sending these but does use exponential backoff with a limit of 60 seconds

#### Keepalive Timer

- Probes from the server to client to see if the client is still up
- The timer sets when probes are sent - it is reset on responses to data and responses to keepalive probes
- 10 probes are sent - if none are answered the connection times out

#### Fast Recovery

- If the sender receives 3 ACK's for the same sequence number (saying the receiver expects that sequence number next), retransmit that sequence even before the retransmission to recover quickly

## Path MTU Discovery

- The path MTU (maximum transmission unit) is the smallest size segment that can be sent without fragmenting from one host to another
- This is discovered by setting the DF (don't fragment) bit in the IP header


## FTP

- Protocol from copying a file from one host to another
- Files can be transferred as a stream of bytes (which is the default) or as a set of ASCII characters
  - "ASCII Mode" is just the ftp client converting the file bytes to a common NVT ASCII representation. At the end of the day what still gets sent is 0 and 1's, ASCII mode just represents the 0's and 1's in a common format that works between any host
  - I believe Unix systems transfer all files as just streams of bytes
    - End of file (EOF) is determined by closing the connection
- It is sent as a contiguous stream of bytes
- Uses telnet (insecure) (sftp probably uses ssh)
- Uses 2 TCP connections
  - Control connection to orchestrate the transfer
  - Data connection to send the bytes