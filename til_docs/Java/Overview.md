## Java Overview

- The three key pieces of the Java Platform (Java SE - Standard Edition) are:
    1. `jdk` (Java Development Kit)
    2. `jvm` (Java Virtual Machine)
    3. `jre` (Java Runtime Environment)
- Java "versions" essentially package all of these 3 components (by just including the jdk. Since the jdk includes the jre which creates the jvm)
- OpenJDK vs. Oracle JDK
    - `OpenJDK` was originally released in 2007 from sun microsystems (bought by oracle)
    - Both are implementations of the Java spec
    - Oracle JDK is based on a build of `OpenJDK` and just has a paid support plan
    - For all intents and purposes we should be using `OpenJDK` if you don't need support. They are at feature parity now.
- After Java 7, the `main` method is required as the entrypoint to every java program (e.g. running a Java `.class` file)
- Java has a strict rule of class name == file name
    - To have multiple classes per file they must be nested
- Java is garbage collected
- There are no pointers, multiple inheritance, or operator overloading
- Java has reflection
- The `CLASSPATH` variable tells jdk tools where to look for java classes
- If a class "implements" and interface that means it subclasses that interface
- There doesn't seem to be a good way to implement optional arguments (like `kwargs` in Python)
  - The builder pattern is the best way to simulate this in Java `.builder().calories(100).sodium(35).build()`
- Frameworks like `EasyMock` allow you to generate dynamic mocks like `MagicMock` in Python

### JDK

- The jdk allows Java developers to create Java applications
- It contains:
    - The Java compiler
    - Everything the JRE contains (which also contains the JVM)
    - jdb (Java debugger)
    - javadoc (documentation generator)
- 
### JVM

- The jvm runs actual Java programs

### JRE

- This is the on-disk component of Java that creates the jvm

### Anatomy of a Java Program

- Source files are `.java`
- Java class files (`.class`) are bytecode and can be executed by the JVM
    - Each class file corresponds to a `class` in Java
    - This can then be run by the jre (`java`)

#### Getting started with a hello-world Java application

```bash
javac Main.java
java Main
```

### Scopes

1. Method scope

Variables defined within a method are accessible anywhere following within a method

2. Block scope

Variables defined within curly braces cannot be accessed outside those curly braces


#### Interfaces

- An interface is an abstract type that contains a collection of methods and constant variables
    - This is similar to `ABC` in python
- These are used to achieve multiple inheritance
- Interfaces can't be instantiated directly
- The `default` keyword can be added to interfaces to represent the default implementation
    - Classes that `implement` this interface can then override this default if required

#### Abstract Class

- Very similar to an interface, however it can have non-abstract methods
- You can only extend one abstract class
- Can have more access modifiers rather than static and final
- Interfaces vs. abstract classes:
    - Abstract classes represent what an object *is*
    - Interfaces represent what an object can *do*
        - Interfaces are a promise that the functionality will be implemented (e.g. can walk)
        - Abstract classes describe what something is (e.g. mammal)

#### Source File Declaration Rules

- There can only be one public class per source file
    - This should be the name of the file
- A source file can have multiple non public classes
- If the class is in a package then the package statement should be the first statement in the file
- Import statements go between the package statement and the class
- Import statements apply to all classes in the source file


#### Access Modifiers

- Public: Available to classes outside the package
- Private: Available to only the class
- Protected: Available to the class and subclasses
