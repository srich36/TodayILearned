### Rendering Engines vs. Javascript Engine

A Javascript engine, like `v8` is the engine that processes and runs the webpage JavaScript. "Hot" code paths are optimized for quicker execution (e.g. looking up a property in an object directly). The browser JavaScript engine queries the rendering engine for displaying things.

A browser rendering engine, e.g. `Gecko` and `Webkit` displays the webpages written in the markup language. This interprets `HTML`, `CSS`, `XML`, images, etc. and produces the final webpage for the browser.

### General Language Tips

- When you inherit a class and it does not override the constructor it calls the parent constructor by default
- `Array.slice()` returns a shallow copy of an array
- The spread operator `...` was originally added for arrays in es6. However, a later change enabled the spread operator to be used with objects too, e.g. `const newObj = {...obj}`
- You can compress bundles with `gzip`, `bzip`, etc. to greatly reduce bundle size
- Wrapping code that spans multiple lines with `()` prevents the pitfalls of automatic semicolon insertion
- In JavaScript, class methods are not bound by default. That means that the class method's `this` keyword will not always refer to the class itself - it will refer to whatever called the function
  - To bind the function to the class you can do `this.myFunc = this.myFunc.bind(this)` in the class constructor
- Computed property syntax: `[varName]` -> will result in the string value of `varName`

e.g.

```JavaScript
myVar = "computedPropName"
{
    [myVar]: "computedPropValue
}
```

will result in 

```JavaScript
{
    computedPropName: "computedPropValue
}
```
- A `+` in front of a variable returns the numeric representation of it (e.g. `const b = +a`) (same as `const b = Number(a)`)

## Browser APIs

- `Temporal` -> coming soon to support `moment.js` like timezones
- `Proxy` -> allows you to intercept an access to an object and perform any side effects on sets, gets, etc.
  - Can implement request interceptors this way without the request library supporting it natively

## Maps vs. Objects

- Maps can have any key (not just strings)
- Can iterate over keys in insertion order
- Can easily get size of map
- (Maps are better for dynamic keys, even though objects have historically been used as them)
- See https://stackoverflow.com/questions/18541940/map-vs-object-in-javascript
