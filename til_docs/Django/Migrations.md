## Migration Order

- Django determines the proper migration order by building up a dependency graph based on dependencies and `run_before`
- Migrations are run inside a transaction by default in Postgres

