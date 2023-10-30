# Overview

- Map Reduce is an algorithm and implementation for processing large data sets
    - Users specify a `map` function that operates on a key/value pair to produce intermediate key/value pairs
    - A `reduce` function then merges all intermediate values with **the same intermediate keys**
- **Programs written in this style are automatically parallelizable**
- The run-time system handles partitioning input data, scheduling the program execution on machines, and handling inter-machine communication
- The output for deterministic map and reduce functions will be the same as if the program executed sequentially
- The Google MapReduce library is a C++ implementation 
- One of the major benefits of map reduce is that parallel programming, fault tolerance, inter-machine communication, etc. is abstracted away from the user


## Examples

- Counting the number of occurrences in each word in a really large set of documents
- Counting URL access frequency from a large set of logs
- Building an inverted index
    - Map over a set of large doucments, and generate a sequence of (word, document id)
    - Reduce each (word, document id) pair to a (word, list(document id)) list as an index

## Execution 

- Input data is partitioned into `M` partitions
- The map jobs are scheduled on a set of different machines
- Reduce jobs are then partitioned into `R` partitions by using a hash function on the intermediate key -- therefore each key will belong in the same partition
    - The output space of the map jobs will be a different size than the input data size
- One of the `M` copies is deemed the master program and the rest are workers
- The master pings workers to detect failures and will restart jobs upon worker failures
- The master hosts an http server with some status pages that the user can see 

### Steps

1. The master picks idle workers and assigns them one of the `M`map or `R` reduce jobs 
2. The worker executes the map job and stores the immediate results in memory
3. Periodically, the workers write the buffered `M` output into `R` regions in memory
4. The location of these `R` regions on disk are forwarded to the master who will forward these to the reduce workers
5. Reduce workers load this data through RPC and then sort the keys so they see all the output keys with the same value
6. The reduce function then operates on the keys and appends the output to a file for that reduce partition  
7. When all map and reduce tasks have been completed, the master wakes up the user program to go back to user code 
8. There are now `R` output files (one per reduce task). Typically these get passed to another `MapReduce` call or use them in another distributed application

## Fault Tolerance

- Since the master is unlikely to fail, the current implementation just aborts map-reduce if the master failures
    - You could checkpoint the master data structures however
- 