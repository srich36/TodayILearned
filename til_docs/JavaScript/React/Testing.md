# Testing

- end-to-end test: Test the entire flow of the application - both frontend and backend together

### Shallow Rendering

- Renders a component one level deep. Any nested components taht are not DOM elements are not rendered or instantiated

### Jest

- Jest is a test runner that allows you to access the DOM via `jsdom`, an approximation of the browser
- You can mock anything with `jest.spyOn` for API calls
- Run `jest --watch` to watch tests, rerun failed ones, etc. 
- Overrite function implementations by using `jest.spyOn(<Object>, <method>).mockImplementation( () => {...})`

### Snapshot Testing

- Allows you to save rendered component output and ensure a change to the component is explicitly committed
- If a snapshot doesn't already exist, calling `.toMatchSnapshot()` will generate one
- When you need to update your snapshots, you can do something like `jest --updateSnapshot`

### Enzyme 

- Testing library for `React` that easily allows you to test components' output
    - Adds additional functionality to `Jest`
- If you have a HOC you need to call `dive()` to get the original component if you shallow mount it
- `wrapper.debug()` prints a string representation of the wrapper


### Common Gotchas

- Since any `setState` methods are asynchronous, you must call `wrapper.update()` before using any of the results


### Material UI specifics

- If your components use a custom theme you must wrap them in the custom `muiThemeProvider` when mounting them for testing
- If a component is not `open` it will not be mounted in the DOM. Thus you cannot test for it until you provide the open prop