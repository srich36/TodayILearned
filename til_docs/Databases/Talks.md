# CMU Database Talks


### Finding Logic Bugs - SQLancer

- Initial approach:
  - Run same query against same data on multiple DBMS -> check result differential
  - Only works on small SQL
- An "Oracle" is a DBMS you are comparing your own query results to
  - A test oracle is basically a way to determine if a test passes or fails
- Better approach: query partitioning
  - 1. Take a query's result set, break it down into a set of queries for each piece of the result set
  - 2. Run the each of the partitioned queries
  - 3. Combine the result sets of the partitioned queries
  - 4. If the combined partition result set is not equal to the query's original result set, there is a logic bug


### Materialize

- Database optimized for streaming
  - Retains a materialized view for your tables that are automatically updated as event streams come in


### Dolt

- "Git but for data"
  - Works on human scale data -> can see data diffs, commit, and pull from dolthub
- Essentially works by storing a hash map of every memory address to location on disk. Each "node" in the git-like graph points to other nodes containing more direct memory addressed column information, etc.
  - `Prolly trees`: an index data structure like B-tree that uses a probabilistic rolling hash for determining when to allocate a new index node, directly index the data to locations on disk
- Each node contains the hash of its contents, thus on diffs you don't have to send an entire new copy up to be committed (only the changes) and you know nothing has changed if the hash of the contents is the same
- This was a really good talk I should go listen to the second half of it (the more technical side) again

### Cassandra As a Service

- Distributed, fault-tolerant NoSQL database
- When a request for a new Cassandra instance comes in
  - 1. Provision a new node
  - 2. Install Cassandra on that node
  - 3. Attach it to an existing cluster (scaling/creating one of the initial nodes in one of the 3 availability zones)
  - 4. Run health checks on the node to ensure it is functional

- Asynchronous communication:
  - Messages are placed into a queue which gets processed by the cluster command processor. The response is then put back onto a response queue.
    - Each customer subscribes to their own queue, then there is also a shared queue for all customers

### Automatic Regression Detection and Analysis

- *Regression analysis*: When a database upgrade version causes query slowdown
- This is a proposing of the `Apollo v1` framework
- The same process runs on multiple database versions to find these regressions
- 3 step process:
  - 1. Fuzz query generation from an SQL grammar probability table
  - 2. Feedback driven fuzzing. If a query is slow, a given operator that it includes in the grammar table has its probability increased
  - 3. Regression Validation. Put randomly generated queries through a list of heuristics to ensure they are "normal" queries, the system has enough memory, etc.
- Once a regression is detected the SQL minimizer attempts to extract the portion of the query that caused the regression for a bug report
- Uses `git bisect` to get exact version of regression cause