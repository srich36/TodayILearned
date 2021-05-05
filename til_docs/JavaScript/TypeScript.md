# TypeScript

- You can specify the type of the arguments being passed to a function with `func<type>(var)`, e.g. `helloWorld<string>("test")`
  - **The angle brackets should only be used when using generic types**
  - When you call `helloWorld<string>("test")` the `helloWorld` function accepts a generic type and you are setting the generic type to be a string
  - You can have multiple types within the angle brackets for the multiple arguments
  - This is often done by type inference with `helloWorld("test")`
- For generic functions, you can use `any`, but this loses the information of the type that is passed in. The generic `Type` can be used to specify the type of the variable and the return type (e.g. making sure they are both of generic type `Type`)
- Arrays can either be declared `Array<string>` or `string[]`
- Using `|` between types is an `or`
- `declare function ...` just specifies the types of a function, not its implementation
- `*.d.ts` files are used to provide type information for modules written in pure js
    - You nam `*.d.ts` the same as the `.js` file and put it in the same relative directory path as the library you are typing uses
- The `declare` keyword tells TypeScript you are describing code that lives elsewhere
