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
