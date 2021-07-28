## Migrations

- Migrations are run in a transaction by default - if it fails then none of the changes will be applied
  - This only applies to databases that support transactions
- Model methods are not available in migrations (e.g. `__str__`, property methods, etc.)

## contenttype

- The `contenttype` app automatically builds a table that assigns each model type an ID
- Thus, with the `contenttype` framework you can access any model type by it's model ID
- Therefore, any instance in an entire app can be accessed by the combination of two things: the model Class' contenttype ID and the instance's primary key
- This is why for generic relations you need a field to store a foreign key to `ContentType` **and** a positive integer field for the instance ID's you'll be relating to
- `ContentType` is a model that has fields
  - `id`
  - `app_label`
  - `model`
- `ContentType.objects.get(app_label=<app_label>, model=<model>`) where `<model>` is the no-space, lowercase model name as a string

### Generic relations

- Since with the two keys you can access any instance in any Django table, this enables `generic relations`
- A generic relation is a foreign key pointing to any generic model
  - Without generic relations, you must decide what model the foreign key points to initially. With generic relations the foreign key can point to any model
    - This allows a model to have a foreign key to any model type (e.g. an attachment model pointing to any other model in the database)
- declaring a `GenericRelation()` is a way to access this in reverse from the model the generic relation points to
- Generic relations use composite keys, requiring two hits to the database
  - Thus it is a performance tradeoff, and these should only be used when necessary

### Custom Migrations

- Must use `apps.get_model()` instead of loading the model statically because your model might change during the migration runtime
- Create an empty migration file with `manage.py makemigrations --empty --name <name> <app>`
- Custom migrations use **historical** models with `apps.get_model()` therefore you won't be able to use `contenttypes` `content_object` in generic relations
  - You will have to load `contenttype` yourself and set the `object_id` and `content_type` on it