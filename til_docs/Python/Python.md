# Python Basics

- **Generators are fundamentally a way to interleave library code and user code, e.g. pausing in a function to be 
returned to**
    - For example, this could be used by a library to ensure methods 1, 2, and 3 are called in the correct order

### Meta Classes

- Meta Classes are classes where instances are of a class, rather than an instance of a class. Instances of meta classes can be used to define class behavior. Not a ton of languages support meta classes and the implementations differ (Python does).
- All classes are instances of `type`, the base metaclass
- Can create a class dyanmically with `type(<name>, <bases>, <dict>)`
- The metaclass `type` implements `__new__`, `__init__`, etc. To override the `__new__` for any
class creation you can then create a new metaclass that inhereits from the base metaclass `type`, and override, `__new__`.
  - **Note that here `__new__` is for class creation, whereas __new__ in a normal class if for instance creation**. That's why you have to override it in the metaclass if you want to ensure every time the user of your code (e.g. library code users) defines a new class it runs the `__new__` method
  - You can then, in the class definition, put 
      ```python3
        class Foo(metaclass=<custom_metaclass>):
             pass
      ```
- You can also solve these problems with simple class inheritance or class decorators, but can use the metaclasses to ensure that derived classes implement required abstract methods, etc.
    - This is how `abc` works
### Keyword Arguments

Python3 (and 2) supports keyword arguments e.g. `myFunc(b=2, a=1)` where the order of the parameters passed doesn't matter. The above is equivalent to `myFunc(a=1, b=2)`. You can mandate arguments be passed as keywords

### Python \* Operator

\*args unpacks an iteratable object into its individual items. For example, if args = [ 1, 2, 3, 4 ], \*args will become 1,2,3,4. This is the same as the spread operator `...` in Javascript. This is argument `unpacking` it unpacks an iterable object into its individual components

### Python \*\* Operator

Similar to the \* operator \*\* unpacks a dictionary into keyword arguments. If `dict = {a: 1, b: 2}` then `**dict` turns into a=1, b=2. Thus in a function myFunc(\*\*dict) this is transformed into named keyword arguments with `myFunc(a=1, b=2)`

### Decorators

### Function Basics

Functions are first class objects in python. This means they can be passed around as arguments, etc. In general, a first class object is an object that has all the rights and abilities as other variables in the programming languages. Things that can't be passed as arguments, e.g. functions in `C` are called second-class arguments.

You can define functions inside other functions - these are called `inner functions`. Inner functions are not defined until their parent function is called. They are locally scoped to the parent function.

You can also return functions from other functions. Just like in JavaScript, the function name refers to the function itself where invoking it returns the value

Decorators just wrap a function and modify its behavior. What this does is calls a function by passing in a function which then returns a new modified function. The `@` symbol is syntactic sugar for this entire thing. So `@<decorator_function>` above another function will pass the function that is below it into `<decorator_function>` and the function below it will then have the modified behavior when called.

This may not have been worded the best so here is an example:

```python
def do_twice(func):
    def wrapper_do_twice(*args, **kwargs):
        func(*args, **kwargs)
        func(*args, **kwargs)
    return wrapper_do_twice

@do_twice
def printWord(word):
    print(word)
```

Calling `printWord` will now print the word twice. You always want to include `*args, **kwargs` in decorators so you can pass in an arbitrary number of arguments.

### Introspection vs Reflection

`Introspection` is the ability for an object to know about itself at runtime. `Reflection` is one step further: the ability to modify itself at runtime.

### General Tips

- To get a value from a tuple you can convert to a dictionary and then use the get method
- Set: A collection that is unordered, unindexed, and unique
- Python 3.5+ supports type hints
  - `def my_func(num: int) -> str:`
- **Ellipses** are officially supported python3 syntax that do the same thing as `pass`
- Any object can implement the **__call__** protocol ( obj() ) to define the behavior when surrounded with parentheses
- **All top level syntax has these analogues**
  - __call__, __iter__, __add__, etc.

### Stub Files

- `.pyi` files provide "stub" implementations for type annotations for Python files
- mypy, pyright, etc. load these stub files over .pyi files to do autocompletion, etc. as lsp's 
- Stub files are written in normal Python3 syntax with variables, default arguments, function bodies, etc. ommitted

e.g. (ellipses are convention instead of pass)

```
x: int

def my_func(a: int) -> bool: ...
```


### LSP's

- `pyls` -> Palantir Python language server (slow on large projects)
- `pyright` -> from Microsoft, faster on larger projects
