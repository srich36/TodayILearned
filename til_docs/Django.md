# Django Basics

### Queryset API

- `get(pk=<num>)` will return one object of the model instance
- `filter, exclude` will return querysets
- Querysets are sliceable like `<ModelName>.objects.all()[:5]`
- `update` takes keyword args to update a model
- **All queryset methods,** `update, save`**, etc. except `delete` are also exposed to the model manager to act on all objects**
- `selected_related()` follows foreign key relationships

### Field Lookups

These are predefined keyword arguments to queryset filter methods to help filter the data. **They generally take the form `field_name__lookuptype=value` e.g. `Posts.objects.all().filter(pub_date__lte='2016-01-01')` for less than or equal to.**

**Alternatively if you don't have a lookup type you can just do `field_name=value`**. This is just synatactic sugar for the default `field_name__exact=value`.

### Relationship spanning

Filtering can also span relationships. For example, consider an Entry model with a foreign key to a Blog model with a name field. You can filter with `Entry.objects.all().filter(blog__name=value)`

### Related Name

Related names are set on the model defining a foreign key field with `related_name=<related_name>`. This can be then used to essentially reverse query from the original model all the model instances with foreign keys references to it. Take this example:

```python
class Department(models.model):
    description = models.TextField()


class Employee(models.model):
    name = models.charField()
    department = models.ForeignKey(
        'Department',
        on_delete=models.CASCADE,
        related_name="employees"
    )
```


### select_related

Select related is a way to pre-populate foreign key relationship data in one query instead of grabbing the initial model, then getting the foreign key representation of it. This accomplishes the same thing as normal indexing but in one less database hit. While that does not make a ton of sense, an example will clear it up

```python
post = Post.objects.get(id=2) # Hits database to get post
user = post.user # Hits database again to get user
```

```python
post = Post.objects.select_related('users').get(id=2) #
user = post.user # Doesn't hit the database because the post model is already populated with user because of select_related
```

From a department instance you can get all employees with a foreign key reference to that department with `<department_model>.employees.all()`. Without setting the related field you would have to do `<department_model>.employee_set.all()`.

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

You can easily chain queryset filters together. This chaining is immutable and returns a new queryset every time
