## General

- When connecting to a database through `psql` it uses the default schema `public`
  - To see all tables in a different schema run `\dt <schema_name>.` (don't forget period)

## TOAST Storage *The Oversized Attribute Storage*

- Only for data types with varying lengths
- Postgres constrains the maximum page size to 8kb, and anything else can't fit into one page (tuples can't span
  multiple pages)
- Any data that is entered that is over the configurable TOAST threshold (2kb by default) is 1st attempted to be
  compressed and if compression under 2kB is unsuccessful is stored in the TOAST table for that table
- Any table with an element that is of varying length will have a TOAST table
- For varying length data fields, the first 4 bytes in storage are the total size of the data being entered
  - Within this 4 bytes of overhead is a pointer to out-of-line data (not in the same row, e.g. a pointer to the
    TOAST table corresponding to that table) if the data is large enough to be TOAST'ed

## CTEs

- Prior to Postgres 12, CTEs were always materialized once per execution
  - This allows the results of CTEs to be cached per query, allowing it to only run once per execution
  - **However**, this did not allow the optimizer to push down the predicates

e.g.
```sql
with materialized_set as (
    SELECT * FROM large_table
)
select * from materialized_set where materialized_set.id = 50
```

The above query would take much longer than

```sql
SELECT * FROM materialized_set mset where mset.id = 50
```
or even a subquery because the predicate (id = 50) can be "pushed down" and an index scan can be used to only find the row(s) with id = 50 instead of first scanning the whole table

- In postgres 12+ CTEs are automatically inlined (e.g. as subqueries) and thus avoid this problem

## Aggregations

- When comparing two arrays with `MAX` postgres, goes value by value, and picks the entire array corresponding to the array with the first largest value
  - e.g. for `MAX(Array[1,2], Array[2,1])` the output would be `[1,2]`


## Database Size Managment

- `pg_total_relation_size` -> size of a table, it's TOAST table, and its index(es)
- `pg_column_size` -> size of one column (only the part that is non-TOASTED)
- `octet_length(col::text)` -> force the db to get the full value (if toasted) and return the uncompressed size
in bytes
- `pg_size_pretty` -> pretty print kb, mb, gb, etc.


