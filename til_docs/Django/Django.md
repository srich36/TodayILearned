# Django Basics

### Authentication Backends

Authentication backends in Django are simply classes that implement `get_user` and `authenticate` methods given a primary key and credentials respectively. If multiple authentication backends are specified in the configuration, Django will try all available backends until a successful authentication is found

### Custom User Models

It is recommended to create a custom user model whenever you are starting a new Django project. To maintain all the built in functionality of password hashing, etc you can inherit from `BaseUser` and point `AUTH_USER_MODEL` to the custom user

### Automatic Primary Keys

By default Django gives every table the field `id = models.AutoField(primary_key=True)` which is an auto updating primary key

### Random Tidbits

- For an app that doesn't have a migrations directory yet, e.g. and app that is just created, you have to run `python manage.py makemigrations <app_name>`

### Meta Classes

##### Models

Meta classes in models represent anything that is not a field, e.g. ordering, column names, etc.

### Model Managers

Model Managers are the most important part of the model as they retrieve instances from the database and provide the database queries. The default model manager is called `objects` and can be referenced by `<model_name>.objects` if not overriden

### Model Logic

It is best practice to include necessary simple custom model functions in the models. These can go with other model functions such as `__str__` and can be referenced by `<model_Instance>.<method_name>;`

### Pre-defined model methods

Django provides pre-defined model methods such as `save()` and `delete()` than can be overridden in the model class by simply redefining `save(*args, **kwargs)` and `save(*args, **kwargs)`. Calling `super(*args, **kwargs)` in this methods will ensure the data still gets saved.

Theses pre-defined methods are why, given an example model `Post`

```
b = Post(text)
b.save()
```

saves a new Post to the database. `save` will update a model if it already exists.

I believe `Post(text)` provides a constructor that can also be accessed by `Post.objects.create(text)`

## Querysets

A query set is essentially a `select` SQL statement with as many filters as desired which act as the `where` statement. Querysets come from the model's manager and thus NOT a model instance.

**A queryset does not actually hit the database until it is iterated through or another form of evaluation.** `<Model></Model>.objects.all()` **will not evaluate the queryset and thus will not hit the database**

- Printing a queryset will evaluate it

You can easily chain queryset filters together. This chaining is immutable and returns a new queryset every time

## General Tips

- It may be best to avoid signals since they are hard to track down and hard to debug
- Go "top to bottom" with urls
  - e.g. plans/\<plan_number\>/approvals to get all the approvals for a plan
- To add a `unique=True` field to tables with rows:
  1. Create migration to add a field without `unique=True`
  2. Create migration to populate existing fields with UUIDs
  3. Alter field to include unique option
  - This is necessary because the initial field value will only be evaluated once when applied to all of the rows, thus it will fail the duplication constraint
- `safe=False` is required in a `JsonResponse` whenever the object you are trying to serialize is not a dictionary
  - `DRF` returns a dictionary type called a `ReturnDict`
- If you are ever getting import errors when you shouldn't be, there might be a circular dependency
  - You can't have a model depend on an external file, then have that external file depend on the model
- When you are serializing an array of items with `DRF` you need the flag `many=True`
- In one to many relationships the foreign key is on the one side
- For rich text fields (`HTML` editing, bullets, strike-throughs, etc.) you can use `Django-ckeditor`
- Comparing two objects with `==` just compares the two PK's behind the scenes
- Django can add backwards relations because it keeps track of the models and the corresponding relationships when models within `INSTALLED_APPS` are imported