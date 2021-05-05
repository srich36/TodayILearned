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

- Filtering can also span relationships. For example, consider an Entry model with a foreign key to a Blog model with a name field. You can filter with `Entry.objects.all().filter(blog__name=value)`
- This essentially just joins entry on blog

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

- Select related is a way to pre-populate foreign key relationship data in one query instead of grabbing the initial model, then getting the foreign key representation of it. This accomplishes the same thing as normal indexing but in one less database hit. While that does not make a ton of sense, an example will clear it up

```python
post = Post.objects.get(id=2) # Hits database to get post
user = post.user # Hits database again to get user
```

```python
post = Post.objects.select_related('users').get(id=2) #
user = post.user # Doesn't hit the database because the post model is already populated with user because of select_related
```

From a department instance you can get all employees with a foreign key reference to that department with `<department_model>.employees.all()`. Without setting the related field you would have to do `<department_model>.employee_set.all()`.

- This works by using `JOIN` in SQL


### prefetch_related

- Used whenever you are getting many of an object.
- Will first grab all the objects in one query, then all the related objects in another query, and do required joining in python
- Everytime you go an extra level deep with `prefetch_related` it will execute another database query since all of those related objects have to be cached in an `all()` query for the joining to be done in Python
- Often uses an `IN` query to do this

### Prefetch

- Prefetch is a function that goes within `prefetch_related and can customize the query that is run (instead of just doing `objects.all()`) when prefetching
- E.g. you can add a `select_related` within this to follow foreign keys


### One-to-One Backward Relationships

- No need for `_set` and returns only one instance, not a manager

### Q expressions

- To do more complex filtering (with and or or) you can use Q expressions
  - | indicats an or, & an and

### F expressions

- Allow you to dynamically grab the value of a field on a model.
  - e.g. Blog.objects.filter(name=F('title')) will get blogs with the name field equal to the blog title field

### Caches

- On the first execution of a queryset Django will create a cache for it. Retrieving objects from this queryset thus comes form the cache.
- The cache is only populated when an entire queryset is executed, a specifc index for example (`queryset[5]`) will not cache results and will run a database query

### SQL to Django

- `LIMIT` and `OFFSET` -> slicing
- `WHERE` -> field lookups
- `JOIN` -> double underscore (\_\_)
- `OR` -> Q expressions
- `NOT` ->exclude()

### General

- Cannot add more filters after slicing a queryset because this would be impossible to translate to SQL
- Multiple filtered listed together with commas with be anded
- `annotate` add a column to the objects in a queryset
- `order_by()` override the default `Meta` ordering