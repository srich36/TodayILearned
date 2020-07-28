## Transactional DDL

- DDL (Database Design Language), e.g. `SQL`
- Transactional DDL is a paradigm where all database operations occur in a transaction
  - They are treated as a single, coherent operation
  - They either all go through or none at all
  - `Postgres` and `SQLite` supports transactional DDL but `MySQL` does not
  - This is a super important concept - non-transactional DDL can leave your database in an inconsistent state if not everything goes through
- Statements that occur in a transaction block can be rolled back