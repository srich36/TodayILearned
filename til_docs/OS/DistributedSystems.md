# Networks

- Wifi: Each host has a wireless transmitter and receiver over which it can send/receive signals
- Connections between cities/ISPs are usually 100Gb/s or faster, it's the connection between ISP and user that is the
bottleneck
- The routing table for routers is populated automatically with `BGP` (Border Gateway Protocol)

## Distribute File Systems

- 2 main approaches:
  - Client/server (e.g. NFS)
  - Cluster-based (e.g. HDFS, GFS (Google File System)) -> for many applications running in parallel with high scalability

### Cluster Based

- Requires more data, I/O. NFS sends data back and forth a lot, cluster based systems send less
  - Traditional client/server models couldn't scale to the level of data cluster-based systems support
- Clients connect to a master *metadata* server which connects to various data servers that hold chunks of files
  - The *metadata* server holds information about which servers hold which portions of which files
  - File chunks are replicated *n* number of times (e.g. 3)
  - Thus, can split the processing up on the different servers by the file chunks
    - This is a common sense architecture
- Clients first connect to the metadata server, which returns information to the client about the data servers that house the file of interest
    - Clients can connect to the closer server if the data is replicated
- Files can be read from or written to in parallel if they are stored on different machines
- The *metadata* server is responsible for rebalancing load/file chunks amongst the different servers
- `MapReduce` uses the cluster based distributed file system to execute jobs in parallel
- HDFS only allows append only writes (this is what most writes are in general) and a single file writer, while GFS allows random writes and concurrent writers

