## Abstract Syntax Trees (AST)

- Code is parsed into its constituent tokens and placed in an AST, which is a tree structure that represents the semantics of the code
- Parser: Something that converts code into a syntax tree

## Refactoring Code with ASTs

- Modifying ASTs and generating the source from those ASTs allow you to programmatically refactor code
    - This is how `eslint` and `prettier` automatically fix code 

## JIT

- The first time a set of instructions is encountered it is compiled into native machine code. This is then cached uponsubsquent invocations
