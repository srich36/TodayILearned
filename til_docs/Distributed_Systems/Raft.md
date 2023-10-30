# Overview

- [Paper](https://raft.github.io/raft.pdf)
- Raft is an easy-to-understand (easier than Paxos) consensus algorithm that allows multiple nodes to agree upon a replicated log
    - Raft's main design goal was **understandability**
    - To do this, core problems are decomposed into independent subproblems -- leadership election, log replication, safety, and membership changes
- Paxos was originally designed to agree on a single entry -- agreeing on a log (multi-paxos) was an afterthought and not fully defined
- 5 servers is a typical minimum for a raft cluster which can tolerate up to 2 failures
- Raft's main difference from Paxos is its strong leadership; everything goes through the leader

# Terminology

- *Leader*: One node in raft acts as the leader, and all logs flow from the leader to other servers
- *Leader Election*: Raft uses randomized timers to elect leaders when the system boots up or a leader is unreachable
- *Membership Changes*: When a server is either added or removed from a raft cluster
- *Replicated State Machine*: The foundation of distributed systems/consensul algorithms. A set of distributed servers operate on the same state and can continue to operate even if some of the servers are down. All servers will agree on the same value.
- *Log*: The replicated state machine log contains state machine commands from clients that will operate on the server
    - The state machine will execute these commands in order -- the consensus algorithm keeps the log consistent and in the same order
- *Safety*: If any server has applied a particular log entry to its state machine, no other server can apply a different log entry at the same index
- *Log Entry*: A entry in the log. This is composed of an index, command, and term number the entry was received by the leader 

## Leadership

- A leader is elected and the leader then has complete responsibility for managing the replicated log
    - It receives requests from clients, replicates them on other servers, and tells the server when to commit the log entries 
- If a leader fails or becomes disconnected from other servers a new leader is elected
- At most one leader can be elected in a given term
- A leader's log is append-only
- The leader handles all client requests; if a follower receives a client request it forwards it to the leader
- If there is a split vote in a candidacy election a new term will start
    - Terms are identified by monotonically increasing integers
- Terms act as a logical clock in raft and allow servers to detect state information
    - If a leader discovers its term is out of date it immediately reverts to follower 
- There are a few RPCs in Raft -- all are idempotent
    - RequestVote (for candidates)
    - AppendEntries (for log replication and a heartbeat)
    - InstallSnapshot (used for leaders to catch slow followers or new cluster servers up to the leader)
    - RPCs are retried upon failures 

## Followers

- Followers are passive and issue no requests to other servers -- they just respond to requests from a leader/candidates 
- Followers stay followers as long as they receive periodic heartbeats from leaders
    - If they don't receieve anything in a period of time called the *election timeout* they convert to candidates 

## Candidates

- To begin an election a follower increments its term, votes for itself, and sends out `RequestVote` RPCs
- Each server can only vote for one candidate in a given term on a first-come first-serve basis 
- If a candidate receives a heartbeat from another leader while it is in the candidate phase, it reverts to follower if the term is at least as high as the term the candidate is proposing
- Election timeouts are randomized between 150-300ms conventionally, but should be an order of magnitude more than the time to respond to RPCs
    - Depending on the node's storage medium this time can be anywhere from ~.5ms - 20ms

## Log Replication

- When a leader receives a client request, it appends the entry to its log then sends `AppendEntries` RPCs in parallel to the other servers to replicate an entry
    - After safely replicating the log, the leader applies the entry to its state machine and notifies the client 
        - Applying the log entry is when the log entry is deemed **committed**
        - The leader commits the log and replies to the client after confirmation that a majority of followers have replicated the log entry
    - If followers crash or are slow, the leader repeatedly retries `AppendEntries` RPCs until all followers have replicated the log 
- Any log inconsistencies (there are a lot of edge cases) are handled by the leader forcing follower logs to match its own
- **How does this ensure safety?** What if a leader commits a log entry, crashes, and a follower who has not replicated the log entry becomes the new leader?
    - Raft adds a new candidacy restriction for this, specifying that only followers who have committed all the log entries in the previous term can become leader
    - **This is done in the voting process**
        - A candidate must contact the majority of the cluster to be elected, which means that every committed entry must be present on one of those servers
        - In the `RequestVote` RPC there is information about the candidates log; if a receiver sees the candidates log is out of date it will not vote for the candidate 
        - Because, to commit a log entry, a majority of servers must have the entry, a candidate cannot ever become leader if all log entries aren't committed 

## Cluster Membership Changes

- When servers are either added or removed from the cluster -- this is built directly into Raft (and is one of the parts often excluded from non-production implementations)
- Configuration changes require a two-phase approach -- cluster switchover is not atomic and any in between time is unsafe without 2-phase
- Configuration changes are committed by the leader in the log
- This is essentially two separate Raft clusters working in tandem 
- Joint consensus
    - Log entries are replicated to all servers in both configurations 
- Agreement requires separate majorities from both old and new configurations  
- Because of joint consensus there is no time at any point where the new configuration and old configuration are both allowed to make decisions unilaterally 

### Cluster Membership Overview 

1. The cluster first switches to a transitional phase called *joint consensus*
2. The system transitions to the new configuration

### Membership Change Process

1. The leader sees a request for a new configuration change and the leader replicates it to the servers as usual, committing the new configuration when a majority of servers have the replicated configuration
    - The first configuration committed is the joint new and old configuration entry
    - Each follower always uses the most recent configuration in its log
2. Once the leader commits joint consensus configuration, it requires consensus from both configurations before commiting
3. Once the new configuration is committed the old configuration is irrelevant and old servers can be shut down 

- Because new servers don't have all the log entries they may be offline for a time before they can accept logs as all the log entries are replicated
    - Because of this, new servers may join the cluster in a non-voting phase where logs are first replicated to them
- If the current leader is not part of the cluster in the new configuration, it steps down after it commits the new configuration 

### Log Compaction

- During log campaction you snapshot the system state on stable storage and the entire portion of the log up to that point is discarded
- Snapshotting is used in zookeeper (though the zookeper algorithm is not Raft)
- Other approaches like log compaction and LSM trees are also possible but aren't defined by Raft 
- Snapshots use copy-on-write so new updates can be accepted without the snapshot being written (e.g. fork in linux)

### Client Interaction

- When a client starts up it connects to a random server and is forwarded to the leader
    - Current leader information is returned to the client and all future requests go to that leader 
- Raft wants to implement serializable semantics
    - If a leader commits an entry before responding to the client and the client retries, a request can be executed twice
    - The solution to this is for clients to use idempotency keys for requests
    - But how does Raft protect against stale reads?
        - Raft leaders check that they aren't deposed by another leader by sending heartbeat requests to a majority of the cluster before responding to read requests
            -  If not, the leader will have the most up-to-date committed information 