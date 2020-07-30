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