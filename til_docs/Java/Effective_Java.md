## Overview

- Java is single-inheritance and imperative 
- The main fundamental libraries are:
    - `java.lang`
    - `java.util`
    - `java.io`
    - These have subpackages

### Creating and Destroying Objects

- Consider static factory methods
    - Can provide these in addition to constructors
    - Unlike constructors, they have names
    - If a class requires multiple constructors of the same signature, you can use static factory methods
    - Can reuse existing objects instead of creating new ones
    - **They can return an object of any subtype of their return type**
    - You can dynamically instantiate classes that don't exist at the time of writing the static factory method by using a service provider framework (registering subclasses, for example)
    - In general, static factories are preferable, so consider them before defaulting to a public constructor
- Generally it can be a good idea to make a public interface that returns a private class with a static factory method
- **The main limitation**: Classes without public or protected constructors cannot be subclassed
- For objects with many optional parameters, consider a builder pattern
  1. Client calls a constructor or default factory and gets a builder object
  2. The client then calls setter like methods on the builder object to set each optional parameter
  3. Then the client calls a `build` method to get the object
- If you just have a grouping of static methods make the constructor private so noone can instantiate
    - Making the class abstract doesn't work because someone can subclass and instantiate


#### Enforce Singletons with a private constructor or enum type

- Making a singleton class can make it difficult to test clients because you can't easily replace it with a mock
- To create a singleton
    1. Keep the constructor private
    2. Export a public static member to provide access to the sole instance (this could be a constant, e.g. `final`, or a factory method that always returns the same instance)
    OR:
    3. Create a single-element enum (this is the preferred approach, since it gives you serialization for free and provides an ironclad guarantee against multiple instantiation)
- The single-element enum might feel a bit unnatural but it's often the best way to create a singleton


