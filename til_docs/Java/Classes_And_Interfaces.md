# Best Practices

- Minimize the accessibility of members
    - A well designed component hides it's implementation details from it's api 
    - Make each class/member as inaccessible as possible
- A top-level class can either be public or package-private
  - package-private classes are only available within the same package 
- A private class defined within another class is only accessible from the class that defined it 
- If you override a super class method, it cannot have a more restrictive access level than the superclass method  
- Instance fields of public classes should rarely be public and should probably not be mutable
- Should always use accessor methods since this gives you the flexibility of changing the api without breaking code
- Write immutable methods (e.g. `complexNumber.plus(complexNumber2))` which returns a new complex number
  - Note the use of `plus` (inferring immutability) rather than `add`
- **Immutable objects are thread safe**
  - This is by far and away the best way to achieve thread safety
  - No thread can ever observe the affect of another thread on an immutable object
- Boxed primitives provide static factories to cache and share instances to reduce memory footprint
- Make every field final unless there is a reason to make it unfinal
    - `final` fields mean the field must be initialized at object construction time -> they can be set in the constructor
- You can call `super` in overriden methods
- If a nested class would be useful outside it's enclosing class bring it into its own class
- Inner class types:
  1. Static member class
- If you declare a member class that does not require access to an enclosing instance always put the *static* modifier in its
declaration since otherwise it will have a hidden reference to the enclosing class
- Anonymous classes are declared and instantiated at the same time and can be declared anywhere in code an expression is allowed
  - Lambdas are now preferred for this
- Limit top level classes to one per source file
  - This is because without this you can define two classes with the same name, and which class is actually used depends on the order
  the files are passed to the compiler
  - **One class/interface per file guarantees that you can't have multiple definitions for a single class at compile time**

# Inheritance 

- Prefer composition to inheritance
  - Because a subclass depends on the implementation of its superclass
  - This means the subclass and superclass need to evolve in tandem
  - If you are trying to alter a superclasses' behavior then you should wrap it with composition
    - Then write "forwarding" methods to forward the calls to the calls on the wrapped class
    - This is also known as the decorator pattern
  - It is safer to subclass and only add new methods, but if by bad luck the superclass adds a new method it might not compile
- **Inheritance is only appropriate when the subclass is really a subtype of the superclass**
  - Follow the "is-a" relationship (is every B really an A?)
- If you use inheritance when you should use composition, you needlessly expose implementation details
- Inheritance is powerful but it is problematic because it violates encapsulation
- **Design and document for inheritance or else prohibit it (with final)**
  - This is a lot more relevant if you are making a package for others to consume
  - if documenting for subclasses, must precisely document the use of overrideable methods (public or protected)
- **You cannot invoke overrideable methods in a superclass constructor**
  - This is because the superclass constructor runs before the subclass, and the subclass won't yet be instantiated
- Designing a class from inheritance takes a **lot** of work
  - Really only consider it for abstract classes

# Interfaces

- Prefer interfaces to abstract classes
- With Java8 they are basically the same thing
- Classes can only subclass one class but can implement many interfaces
- Existing classes can be easily retrofitted to implement a new interface
- Interfaces are great for mixins
- To simplify interface implementations, you can provide an interface and then an abstract skeletal class implementing most of the logic
  - `AbstractSet`, `AbstractMap`, etc.
  - This is done because there are limitations on how much you can implement with default methods (e.g. `equals`)
  - This is the *Template Method* pattern
  - You can also have *Simple Implementations* which is the simplest working example and is not abstract
- Try to avoid using default method to add new methods to an interface
  - It's hard to write a default method that works for every implementer
  - These are still good to have at interface creation time
- Use interfaces only to define types that you can refer to the class by