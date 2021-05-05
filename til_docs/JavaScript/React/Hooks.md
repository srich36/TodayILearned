# Hooks

- They really are an improvement to class based components

- New in version `16.8` and are completely backwards compatible
- **Hooks allow you to split up your components based on pieces of functionality instead of by lifecycle methods**
- They let you "hook" in to `React` lifecycle methods in functional components
  - They don't work inside classes

## useState

- Takes an initial state as an argument and returns the state variable and a function used to update it

## useEffect

- Replaces `componentDidMount`, `componentWillUnmount` and `componentDidUpdate`
- **Both the hook and it's cleanup code runs every rerender**
  - This handles `componentDidUpdate` for you, leading to fewer bugs
- You can pass it a cleanup function to run (essentially `componentWillUnmount`)
- **Only** call hooks at the top level of your function, **never** in if statements or other conditionals
  - Hooks depend on being called in the proper order to maintain state across re-renders and conditionals can throw this out of order and break everything
- Hooks can replace HOCs and render props by giving you a way to reuse stateful logic
  - Custom hooks, etc.

## useRef

- Can be used to create refs for the DOM
- More than this, is a way to keep mutable values around, accessing them with the `.current` property
of the ref
- Returns a plain JavaScript object with the field `current` set to whatever you pass it
    - **This always returns the same object when called, however, so the value of `current` in the ref is persisted across re-renders** (if it was a local variable, it would get updated/recreated every time the component rerendered)
    - This is becauses refs are stored in a React Store
    - **This is why we can use it to access DOM elements, because it, like the DOM elements, persists between renders**
- You can manually update a ref (it's mutable) by setting `ref.current`
- Thus, refs can be used to store "state" that does not need to re-render the component

Quick demonstration of why hooks are cool:

Class-based

```JavaScript
componentDidMount(){
    setupSubscriptions()
    getData()
}

componentDidUnmount(){
    clearSubscriptions()
}

```

here, we are forced to group functions by lifecycle methods, not by functionality

Using hooks, however, this becomes

```JavaScript

useEffect(getData)
useEffect(setupSubscriptions, clearSubscriptions)
```

Allowing us to group related functionality

- Hooks "hook" into lifecycle methods, you wouldn't use them for something like an API call when a user clicks a button
- since `useEffect` runs cleanup code every re-render it handles `componentDidUpdate` by default
- You can specify when not to run cleanup code by passing an array of vars to shallow compare to `useEffect`
- There is a `react-hooks` `eslint` plugin to enforce these hook rules in your code
  - No calling hooks in conditionals, etc.
- `React` matches local variable state to `useState`/`useEffect` in the order in which they were called
  - This is how `React` knows which variable to read for current state for each `useState` call and preserve state on every re-render
    - Recall: for [ myState, setState ] =`useState(0)` `0` is just the initial state. Every subsequent call to that `useState` method grabs the value from `myState`
- If you need a hook to run conditionally you put the conditional inside the hook
- State is completely isolated per component in hooks
- There are other hooks besides `useState` and `useEffect` in the `React` API and you can also write your own as a combination of the API's primitives (`useState`, `useEffect`, etc.)
