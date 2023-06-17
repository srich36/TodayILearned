# Overview

- **The fundamental guarantee of the type system is that any failures will happen at compile time**
  - The compiler inserts automatic casts which are guaranteed to succeed as long as no warnings are supressed
- Before generics, you would have to cast every object when you read it
  - This could fail at runtime
  - Now, the compiler will auto-insert casts for you and tells you if something is wrong at compile time
- Each generic type defines a set of *parameterized types* (e.g. `List<String>`)
- Each generic type also defines a "raw" type which is the name of the generic type without any of the type parameters (e.g. `List`)
  - Raw types behave as if all the generic type information were erased from the type declaration
  - **These exist for compatibility with pre-generics code**. Since there was already a lot of pre-generic java code written jave needed to guarantee 
  that code without these generics still worked
- Generic information is erased at runtime
- Can use recursive type bounds
  - `<T extends Comparable<T>>`
- `@SuppressWarnings("unchecked")` tells the compiler to avoid type checking
  - Should try not to do this
- Can specify a superclass of T with `? super T`
- *Heap Pollution* - Occurs when a variable of a parameterized type refers to an object that is not of that type
  - The automatic casts may fail (`ClassCastException`)
  - This indicates a type failure and will show up in compiler warnings
- There are collections in the standard library that add runtime type "checks" as well 
  - `checkedSet`, `checkedList`, `checkedMap`

## Best Practices

- **Never use raw types**
  - If you use *raw types* your code will compile (e.g. `List` vs `List<String>`) but it **won't check that you are only inserting strings until runtime**
    - This can cause runtime bugs
  - The compiler inserts invisible casts when retrieving elements 
  - **If you use raw types you lose all the safety and expressiveness benefits of generics**
- Prefer `List` to `Array`
  - Arrays are covariant 
    - If `Sub` is a subtype of `Super`, then `Sub[]` is a subtype of `Super[]`
  - Lists are invariant, which is better
    - You will find out errors at compile time rather than runtime
  - Since `Lists` work by type erasure, they guarantee their stuff at compile time
  - Arrays are *reified* and force their element type at runtime
    - Because of this you cannot create a generic array type
- **If a user of a class has to think about wildcard types, there is probably something wrong with its api**
- **If a type parameter appears only once in a method declaration, replace it with a wildcard**
  - This is because you're not actually using the generics for anything
  - Sometimes you might need a private helper method to "capture" the type parameter if you are doing something like taking it out of a list and putting it back in
- The basic rule for an api: **PECS: Producer extends, consumer super** (of an api)
- Combine varargs and generics judiciously 
  - An array is created to hold the varargs, and arrays don't work with generics as touched on earlier (since they are refiable)
  - **It is unsafe to store a value in a generic varags array parameter**
- If the varags generic is truly typesafe, you can use the `SafeVarags` annotation
  - Requirements:
    - Don't store anything in the array
    - Don't allow the array reference to escape
  - **Every varargs method should have this annotation because you should never write an unsafe varargs method**
  - This annotation is legal only on methods that can't be overridden
- An alternative to `varargs` is just to use a `List` parameter since this doesn't use unsafe arrays under the hood