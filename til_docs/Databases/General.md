## General

- View: A set of SQL instructions that comprise a table set. Every time a view is queried the underlying SQL that comprises the view is run to retrieve the query
- Materialized view: A database view that consists of all of the data already loaded - you do not need to run the queries defining the view to return the data
- Window functions: Operate on a set of rows (like a group by) but **does not** squash the results to one aggregated rows
- Inverted index: mapping of content/key/term to location on disk
  - Very effective for finding "needle in a haystack" type values
  - These are search indexes
    - Each *term* points to a *posting list* (list of locations on disk for documents that contain this term)
  -  It is *inverted* because it maps terms -> documents, rather than documents -> terms
     -  It is *no* relation to the indexes used in rows/columns
- A *document* is just anything that is stored in the database
- *Document Sharding* -> Sharded by document, not term. Thus, each document will be shared on different machines. This allows for the use of multiple CPU cores to process a query. Allows for lower latency, but comes at the cost of lower throughput
  - Elasticsearch uses document sharding, as does Rockset, but it is less common
- Traditional sharding shards by term -> each document corresponding to a term will live on a single node (optimizing for throughput)
- *Correlated Subquery* - Where data in a subquery references a value from an outer scope
- `JDBC` - Java Database Connectivity: a java API that allows you to connect to a database, issue commands, etc.
  - Handles Java applications connecting to a database
  - Flow is: Application code -> JDBC -> Database specific JDBC drivers -> Databases
    - You need a JDBC driver for a given database for a Java program to interact with it
- Postgres is not threaded, it just spawns new processes

## Sharding

- Sharding is a more general form of *database partitioning* which is splitting up your data into multiple tables/databases
  - Sharding is just horizontal partitioning 
- In sharding, you replicate the schema across multiple databases, and have some logic or identifier to determine which server
  to look for the data at. This identifier is called a *shard key*
  - One common way to shard is based on the alphabet (e.g. A-G key 1, etc. ), hash the user id (if you're searching for a user, etc.)
- If sending a query for a column that the data is *not* sharded on, the query will be sent to all nodes and the results will be combined
- In distributed SQL databases the data needs to be partitioned across nodes automatically
  - This is transparent to the user

## Column vs. Row Storage

- In row storage, a row is stored contiguously in the storage media
  - This allows for a quick, single IO operation to retrieve the row
- However, sometimes tables have many columns and only a few are touched per query
- In column storage, the values for a given column are stored contiguously on the storage media
  - This allows for the quick retrieval of all values of a column, aggregates, etc.
  - Also, this allows for better compression as values within the same column are likely to be more alike to one another and thus easier to compress

## Schemaless (JSON databases)

- Take up more space than RDBMS's because they must store key:value for all documents where in RDBMS's the key is pulled into the column named and only stored once


## Transactional DDL

- DDL (Database Design Language), e.g. `SQL`
- Transactional DDL is a paradigm where all database operations occur in a transaction
  - They are treated as a single, coherent operation
  - They either all go through or none at all
  - `Postgres` and `SQLite` supports transactional DDL but `MySQL` does not
  - This is a super important concept - non-transactional DDL can leave your database in an inconsistent state if not everything goes through
- Statements that occur in a transaction block can be rolled back


## JIT (Just in Time) Compilation

- Turning an interpreted program into a native one at runtime 
  - In databases, instead of having general purpose code to evaluate a predicate, can generate a function specific to that expression (e.g. `return val=3`, etc. to run natively by the CPU and gain performance improvements)
- Many databases (like Postgres) have support for doing this with `LLVM`

## Vectorized Processing 

- Primarily benefits OLAP queries as it requires a columnar format
- Essentially operate on a column as a vector, rather than a bunch of tuples (rows)
  - The vector becomes the primary unit in the query planner (each vector generally represents one column)
  - Vectors/blocks get passed to query nodes instead of tuples like in row stores