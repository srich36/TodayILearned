### Queryset API

- `get(pk=<num>)` will return one object of the model instance
- `filter, exclude` will return querysets
- Querysets are sliceable like `<ModelName>.objects.all()[:5]`
- `update` takes keyword args to update a model
- **All queryset methods,** `update, save`**, etc. except `delete` are also exposed to the model manager to act on all objects**
- `selected_related()` follows foreign key relationships
- `values_list` returns the values of a query as a list of tuples (unless called with one argument and `flat=true` then it will be a normal list) 
- `values` returns a queryset that returns dictionaries instead of objects
- Both `values` and `values_list` are used when you do not need the overhead of creating model instances
- `using(<alias>)` controls what databases the queryset is executed against

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

- With `related_name` you can reverse the foreign key relationships, accessing `Department.employees`
- Without `related_name` the default reverse accessor is`<Model>.<lowercase_fk_model>_set`. E.g. `department.employee_set`

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

### Q expressions

- To do more complex filtering (with and or or) you can use Q expressions
  - | indicats an or, & an and

