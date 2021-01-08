## General

- View: A set of SQL instructions that comprise a table set. Every time a view is queried the underlying SQL that comprises the view is run to retrieve the query
- Materialized view: A database view that consists of all of the data already loaded - you do not need to run the queries defining the view to return the data
- Window functions: Operate on a set of rows (like a group by) but **does not** squash the results to one aggregated rows


## Transactional DDL

- DDL (Database Design Language), e.g. `SQL`
- Transactional DDL is a paradigm where all database operations occur in a transaction
  - They are treated as a single, coherent operation
  - They either all go through or none at all
  - `Postgres` and `SQLite` supports transactional DDL but `MySQL` does not
  - This is a super important concept - non-transactional DDL can leave your database in an inconsistent state if not everything goes through
- Statements that occur in a transaction block can be rolled back