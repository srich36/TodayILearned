## DataDog Real-Time Metrics Database

- [Link](https://www.datadoghq.com/videos/real-time-metrics-database/)
- Use Kafka to ingest all the datapoints
  - Partition on customer, metric, and moving to an even more custom partitioning strategy
- Write to a variety of datastores with different latency requirements
  - DRAM
  - SSD
  - S3 
- The query engine pulls data from these sources to get the final results

### Querying

- Data is time-series data
  - There is a caching layer on top of this for older data points
- Datadog relies heavily on [sketches](https://lkozma.net/blog/sketching-data-structures/) which are data structures that are probabilistic that
store a summary of a dataset when the full dataset would be prohibitively expensive to store
  - Things like Bloom filters, HyperLogLog, etc.
  - This allows you to answer queries **approximately** to get close and still be efficient
  - In DataDog, this is why you can't ask for the 36th percentile for example, only the buckets of 5%, 25%, 50%, etc.
    - If you wanted to answer this question you'd have to do some linear interpolation
- For 99th percentile reporting Datadog uses a relative error datastructure that reports a value that is within 1% of the true 99th percentile
    - Group the data into buckets and then answer questions about the buckets (DataDog has a limit of 4k buckets but this is never hit)
    - Each insertion: find the bucket, increase the count
    - Queries look at a fixed number of buckets
- The sketches are designed to be combined with one another
  - In various stages these aggregations are combined with one another to distribute the aggregations throughout the ingest + query pipelines