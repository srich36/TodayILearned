## Testing

- Django tests are run in a transaction by default. Thus, any changed made **at the database level** in one test will not affect another tests 
- However, if you create an object in `setUpTestData`, modify one of the object properties (e.g. `obj.name='new_name')`, and then call `save()` on the object, other tests will still have `obj.name of 'new_name'`. 
    - This is because while the database transaction of updating `name` to be `new_name` was walked back, you cannot walk back the in-memory setting of `obj.name` to `new_name`.
    - If you `refresh_from_db`, it will no longer have a name of `new_name` (because the name update was never committed). But if you `refresh_from_db` on a class object in the middle of a test after a database action has been committed, you are overwriting the `self.<object>` in memory and thus it will persist. 
    - However, it is better practice to avoid modifying in memory attributes at all in your tests. Within views, they get different copies of the data so the in-memory updates there are fine.
- If you are using a `tests` folder you must include an `__init__.py` file so the test runner can find and import the tests from that directory