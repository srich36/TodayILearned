# Overview

- Zanzibar is a global, consistent, authorization system
- This is essentially AWS IAM -- it determines if entities can access resources
- A unified authorization system provides consistency across all of your applications -- rather than maintaining an access control
list per application
- The design goals are Correctness, flexibility, low latency, high availability, large scale
- Zanzibar has a configuraton language that allows clients to define relations between users and objects (e.g. viewer, editor, commentor, owner)
- Groups are supported as well, and groups can have other groups as members so there is the potential for nesting
- ACLs (Access control lists) 

## Implementation Overview

- ACLs are at the heart of Zanzibar's auth evaluation -- the API allows clients to create, update, or evaluate ACLs at runtime
- ACLs cannot be geographically partitioned since requests may come from everywhere
    - Thus, the are replicated to tens of regions
- Zanzibar supports consistency in evaluating ACLs by
    - Respecting the order that ACLs are committed to the data store
    - Storing ACLs in a globally distributed database with external consistency (Spanner)
- Low-latency is acheived by having the vast majority of authorization checks being performed on locally replicated data
- ACLs are a collection of object-object or object-user relation tuples 
- Each ACL update is assigned a timestamp (from Spanner) and each evaluation is assigned a timestamp
    - These evaluations take into account all of the modifications up to that timestamp
- An each content change the client requests a `zookie` which encodes the given timestamp in it
    - The zookie and content change are saved transactionally
    - Each ACL evaluation snapshot time has to be at least as fresh as the `zookie` timestamp
        - This prevents old ACLs from being applied to new updates (e.g. `zookie` at t2, ACL update at t1, and snapshot timestamp at < t1)
    - You *could* always evaluate ACLs at the current timestamp snapshot but this would require global consistency and cross-region latency
        - Instead, because of the "at least as fresh as the last content update" semantics, ACLs can be updated at older timestamps and be served from locally replicated data
    - **This is one of the most important parts of the design**
- Whether editor should contain viewer is an application-specific piece of logic -- things like this can be specified in the configuration language
- Relation tuples are stored in spanner with different modifications on each row, so an evaluation can be made at any timestamp
- Data is generally sharded by the object id 
- Paxos is used for data replication consistency 
- Group membership traversal can be represented as a graph where the nodes are users and groups and edges are membership 



