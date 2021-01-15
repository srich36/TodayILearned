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

