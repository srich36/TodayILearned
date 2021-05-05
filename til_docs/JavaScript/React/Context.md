# Context

- Allows you to pass down data throughout a component tree without explicitly passing props
- Used for data that is considered global for a tree of React components (e.g. theme)
- `myContext = React.createContext(defaultValue)` creates a context object that contains a default value (this can be an empty object, a string, etc.)
    - This returns an object that can wrap components with `<myContext.provider value={{ test: 1 }}>`, and every component in the tree will be able to read the object with `this.context` or `useContext(myContext)`
    - The workflow is to create a context outside of the tree, use it's provider within the tree, import it in the other files, and use the `useContext` hook
    - For class based components, setting the `contextType` static property on the component makes the context available with `this.context`
