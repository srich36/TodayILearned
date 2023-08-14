# Consistency 

- Isolation levels
    - Read uncommitted (a transaction can read uncommitted data)
    - Read committed (a query only reads uncommitted data) - as defined by the query start time
    - Repeatable read (if a query in a transaction is re-run the same items and values will be returned)
        - This can experience a "phantom read" where all the same items and values are returned but a new item another query inserted is
        also returned
    - Serializeable - the most strict isolation level, meaning your queries run as if there was no concurrency. Time ordering is not guaranteed here