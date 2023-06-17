## Terminology 

- *Unstructured data* - Datasets that isn't stored in a database format with a data model (e.g. text, images, video)
- *Features* - A set of data points that help quantitatively describe a behavior or phenomenon e.g. (video preferences)
- *Embedding* - The representative vector of an entity (e.g. a movie)

## Manu

- Manu is a cloud-native vector database
- Vector use cases don't really need strong consistency and an RDBMS data model - Manu relaxes these constraints for elasticity and performance
- All write components are log publishers to a WAL, read components are subscribers to the log publishers
- Uses MVCC for concurrency control 
- These design decisions (pub-sub, MVCC without locking) allow the system to be highly scalable
- **In models/applications, they encode the semantics of unstructured data into a higher-dimensional vector space**
    - Similarity based search can be used for recommendations for example, which is a common access pattern and one vector databases are built to support 
- Vector databases support other columns besides vectors, they just support vectors as a native datatype with effecient operations
  - e.g. a manu row might look like pk|feature vector|label|price

## Design Decisions/Criteria

- Complex transactional support is **not** necessary
    - All the semantics for a single entity are encoded in one vector - row-level ACID is sufficient 
- Tunable consistency is important 
  - Is a row available for reading right after insertion?
- Each individual part of the system must be highly elastic
  - Vector search or index building are very computationally intensive, but you waste a lot of resources if those layers are always beefed up
  - Elasticity should be built into the *functional* level, rather than the system level (e.g. separation of storage and compute)

## Implementation

- Manu follows the "log as data" paradigm, where the entire system is a pub-sub log 
  - Each log is given a globally unique timestamp
  - Special log entries ("time-tick") are periodically inserted to signal the progression of event-time
- Manu is composed of 
  - Schema - definition for a row
  - Collection - essentially a table but cannot have relations to other tables
  - Shard - data sharding
  - Segment - a subset of a shard, and the basis of Manu's data placement unit
- Manu has four layers - Access Layer, Coordinator Layer, Worker layer, Storage Layer
  - Because the workers are stateless and independent, they can be scaled easily on demand
  - Storage layer uses etcd for system status and metadata, and s3 as a KV store for object storage
- Logging is split up into two parts
  - binlog, the base part of the log
  - WAL, the incremental part of the log
  - Data nodes convert the row-based WAL into column based binlogs in subscriptions
- Loggers are organized in a hash ring with consistent hashing 
- Brute-force searching for similar vectors takes too long - indexes **need** to be built
  - Manu has multiple different index types that it automatically builds
- Supported vector search patterns
  - Similarity
    - Euclidian distance
    - Dot product
    - Angular distance
  - Attribute filtering 
- For vector search, the query coordinator partition a collection into segments and spread the segments across worker nodes for execution
  - Proxies query and cache this segment information and send requests to the right nodes
- Deletion is tracked via a bitmap - this is consulted before returning results
- Data is retrieved from 3 places: the binlog, WAL, and indexes 

## Example - Video Recommendation Engine

- Features such as search history, age, gender, watch history, etc. are converted into embedding vectors
- Models are trained to encode the similarity between user and video vectors into the same search space
- Recommendation is done by retrieving a set of candidate video vectors from a similarity score relative to the user preferences

## Use Cases

1. Recommendation
2. Searching multimedia 
3. Language models 
4. Security (checking for spam and viruses)
5. Medical, for gene sequence search or drug discovery or health risk identification 


## Misc

- Elasticsearch is also has support for a vector search system 