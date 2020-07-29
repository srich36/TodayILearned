### Syntax Basics

- Curly braces in `JSX` execute a JavaScript expression at compile time
- `<Component {...obj}/>` to pass all the attributes of `obj` in as props to `Component`
  - To pass all props of one component down to another `<NestedComponent {...props}/>`
- Every component provides a `className` property that applies the given class name to the root element in its render function

### Supporting Libraries

- `styled-components`: A React library that lets you style the components with CSS directly in React

### General Knowledge

- React compares the desired next render of a component against the current one, and only re-renders the pieces that changed
- Always make component names captilized
  - Otherwise React will assume your component is a DOM element
