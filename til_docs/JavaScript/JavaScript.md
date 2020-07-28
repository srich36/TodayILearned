### Rendering Engines vs. Javascript Engine

A Javascript engine, like `v8` is the engine that processes and runs the webpage JavaScript. "Hot" code paths are optimized for quicker execution (e.g. looking up a property in an object directly). The browser JavaScript engine queries the rendering engine for displaying things.

A browser rendering engine, e.g. `Gecko` and `Webkit` displays the webpages written in the markup language. This interprets `HTML`, `CSS`, `XML`, images, etc. and produces the final webpage for the browser.

### General Language Tips

- When you inherit a class and it does not override the constructor it calls the parent constructor by default
- `Array.slice()` returns a shallow copy of an array