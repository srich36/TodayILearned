# General

- Anything implementing the `Comparable` interface with a `compareTo` method can be sorted, etc. 
    - You can also write your own custom comparator if you can't edit the object
- In Java 7, static `compare` methods were added to all boxed types, **this is recommended instead of <**
    - There are comparator construction methods which help write more concise comparators
   