### Syntax Basics

- Curly braces in `JSX` execute a JavaScript expression at compile time
- `<Component {...obj}/>` to pass all the attributes of `obj` in as props to `Component`
  - To pass all props of one component down to another `<NestedComponent {...props}/>`
- Every component provides a `className` property that applies the given class name to the root element in its render function
- String attributes can be written in quotes `myAttribute="value"` while any other types need to be written as an expression `myAttribute={10}`
- Property names that come from `HTML` attributes are supported and camel cased in `React`
- Conditional rendering
  - Save condition in a variable then use an `if` statement OR
  - `{ condition && <elements> }`


### General Knowledge

- React compares the desired next render of a component against the current one, and only re-renders the pieces that changed
- Always make component names captilized
  - Otherwise React will assume your component is a DOM element
- React elements are immutable
- Children get passed in as `props.children` -> this is React's way of handling slots
- Always start components with a capital letter
  - If it starts with a lowercase letter `React` will assume it is a DOM element
  - Recommended: name props from the component's point of view rather than the context it is being used in
- You don't need a constructor in a class based component if you aren't doing anything with state, etc. in it
- In apps with many components it is important to free up resources taken by components when they are destroyed
  - Clean up `setInterval`, stuff in `componentWillUnmount` etc.
- You can set other attributes on `this`, not just `this.state`
  - It is best to do this if the attribute doesn't belong in the standard data flow
- The only place you can assign `this.state` is in the constructor
- `setState` is asynchronous
  - `React` may batch state updates for performance reasons
  - When updating previous state to compute the next state, you need to use the overloaded function version of `setState`
- Generally if you refer to a method by name and not invocation you should bind it
- Generally binding is better than arrow functions since a new function isn't created on every render, whereas it is with arrow function
- To prevent a component from rendering return null in the render function
- For lists every element in the array needs a key
  - You should avoid using index until a last resort because `React` will not be able to efficiently render reorderings
- keys are not passed as props to components
- Shared state between sibling components is shared by "lifting" it up to the closest common ancestor
- There should always be **a single source of truth in your data**
  - This way it is easier to track down bugs and there are fewer of them
- `React` components are composable by design -> you don't ever need inheritance
- You can use a babel plugin for component and line number debugging
- hocFunction(args)(Component)
  - This syntax represents when `hocFunction(args)` returns another function that is a HOC that wraps `Component`
- Generally try and use the spread syntax for passing props sparingly because it allows you to pass extraneous data
- `Booleans`, `Null`, and `Undefined` don't render
  - make sure expressions are truly Boolean when using them in JSX
    - falsy expressions in JSX can still render (e.g. `messages.length` if messages has 0 length)
- Extending `React.PureComponent` implements a shallow comparison in `shouldComponentUpdate` of previous props with the next props
- Remember: **Always replace state, not mutate it**
  - Use `Object.assign`, `concat`, `...` syntax to set new state
- `React` has portals
  - This can allow you to render a component outside the current component tree
- `React` has a `Profiler` component that allows you to measure the cost of rendering that part of a tree
- You can't use `refs` on functional components because they don't have instances
- `<React.StrictMode>` doesn't render any UI but activates additional checks and warnings
  - You can use this at any point in your component tree
- **Component lifecycle methods should not have side effects**
- `AJAX` calls generally go in the `componentDidMount` lifecycle method
- General: Debouncing - ensure a method will not execute until a certain amount of time since it was last called
- When passing a component as a prop you need to instantiate it (e.g. `prop={<MyComponent/>}`) rather than just representing the component class (`prop={MyComponent}` **wrong**)
- The component constructor gets called before `componentDidMount`. For asynchronous actions that will update state it is best to put them in this lifecycle method

### JSX

- Since `JSX` compiles to `React.createElement` you need to have `React` in scope
- You can render component types dynamically but first need to assign the type to an uppercase variable before using computed property syntax is `JSX`
- You can pass any `JavaScript` expression as a prop by surrounding it with {}
  - if/for are not expressions so they can't be used directly
- No value with a prop defaults to a `true` boolean
  - e.g. `<MyTextBox autocomplete>`
    - This is generally not recommended since it can be confused with `es6` destructuring
- Comments in JSX `{/* comment */}`

### Events

- Events are all camelCased in `React`
- There are two main ways to pass args to event handlers
  - 1. `onClick={(e) => this.handleClick(id)}`
  - 2. `onClick={this.handleClick.bind(this, id)}`
    - This works because with `bind` any further arguments are automatically forwarded
- DOM events bubble up by default
- Synthetic Event: a cross-browser event wrapper to the `NativeEvent`

### Optimizing Performance

- If optimizing for performance **make sure you are testing with the production build**
- Webpack `v4` minimizes code in production mode
- See `React` official docs for a good example on profiling components
- `Virtualize` or `window` long lists: `react-window` and `react-virtualized` for a big performance boost

### Code Splitting

- Can be used to "lazy-load" just the things currently needed by the user
- Can use `React.lazy` rendered in a `<Suspense>` component to dynamically load in components
- `react-loadable` handles this all for you
- A good practice would be to lazy load each main route container in bigger applications

### Supporting Libraries

- `styled-components`: A React library that lets you style the components with CSS directly in React
- `react-loadable`: For code splitting
- `test-renderer`: Get JSON representation of components
- `react-helmet`: Manages the `html` document `head` tag

### Slots

- Can be accomplished by using `props.children`
- Can also have effectively named slots by using named props (e.g.)

```JavaScript
<Comp1
    myFirstSlot={<h2>In props.myFirstSlot</h2>}
>
<h1>In props.children</h1>
</Comp1>

```

### Terminology

- Controlled component: A component whose value is controlled by `React` state
- Higher Order Component (HOC): A function that takes a component and returns a new component
  - It wraps the input component in another component
  - It is important to set a proper `displayName` for easier debugging
- Reconciliation: the process of updating the state of the DOM to match the state in `React`

### Error Handling

- Error Boundaries: A component that catches all errors anywhere in its child component tree, logs them, then displays a fallback UI when an error occurs
- You generally just define one Error Boundary component then use it throughout the application
  - The granularity of component trees you use it on is up to you
- Uncaught errors result in unmounting the whole tree
- Error boundaries do not catch errors in event handlers since they don't have to do with UI

### PropTypes

- Set the `propType` attribute on a class
- Can add custom validators
- `props.element` refers to child DOM components

### Default Props

- Set the `defaultProps` attribute on a class

### Ref Forwarding

- Allows you to take the `ref={ref}` and pass it down to child components
- You need to use `React.forwardRef` for this, because the ref doesn't appear in props. Otherwise there is no way to access it
- This is really useful for HOCs
- Without `forwardRef`, the ref will refer to the outermost component you place it on, _not_ the child one
- Can set a `displayName` for the component to be seen in dev tools as a variable on the class

### Render props

- A render props is a function that you pass in to a child component that gets called during the child's `render` method. This can allow you to add code to be called in the child `render` without it caring about what it is
  - This essentially does what a HOC does

### Advanced Guides

- `aria-*` attributes are hyphen-cased in `React`
- You can use `React.Fragment` to wrap sibling components in something that won't render in the DOM. Shorthand syntax `<> </>. This is useful when you need to wrap a group of components together to satisfy the one root element requirement
- `refs`: Can create a ref with `React.createRef` and pass it in as the ref param to a component
  - **`refs`** are not passed in and available in `props`
  - When you use HOCs you should pass in the refs to the wrapped component. You can do this with `React.forwardRef`
- Context: Allows you to pass values down to all child components _without_ having to pass props manually every time
  - Used for global data, e.g. theme
  - Component composition is often a much better solution since it keeps components reusable
  - You should not abuse this as well and expose a bunch of data to props that don't need it
- Static Type Checking: identify problems in your code, add autocomplete, etc.
  - This is why `Flow` or `TypeScript` are better than `PropTypes` for large apps

### API Reference

#### React

- `React.memo` - returns a memoized result of a Component. It's a HOC. This is similar to `React.PureComponent` but for functional components

#### ReactDOM

- `unmountComponentAtNode`
- `findDOMNode(Component)`
- `createPortal`
- See DOM elements documentation for available `HTML` attributes
  - Almost all are the same as regular `HTML` but in camelCase

## Tips

- `componentWillReceiveProps` is deprecated but sometimes you may need to initially set some state whenever a component changes. You can do this using a `key` prop. `key` props in general ensure the component rerenders whenever the component changes. You can thus set an intial state value in the constructor, then only when the key changes will this value reset.