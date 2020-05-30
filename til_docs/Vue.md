### Vue Tidbits

Vue supports passing invoked methods into event handlers like `@click=myFunc(myVal)` because `myFunc` is not actually being executed until the click event is registered.

- Vue does not bubble up events through multiple layers of parent components. For native events you can listen to the native browser event (which will bubble) with `@<event>.native`

## Vue Material Design Frameworks

After much chagrin messing around with `flexbox` and UI/UX design over the past however many months I have finally decided to use a design framework - it is vastly superior to anything I could come up with.

### Vuetify

More complex, great documentation, and more of a sacrifice in control over your app. E.g. using `<v-col col=8 lg=12>` instead of `<div class="col col-lg-8">`. However, much of the bootstrap API is implemented. Beautiful UI components available. Probably going to use `Vuetify` in the future.

#### Vue Material

Relatively simple component framework for `google material design`. Implements much of the `boostrap` display, margin, and padding classes. Easy to use but lacks somewhat in configuration.

### Testing with Vuetify

You can access `Vuetify` components specifically with `wrapper.find({name: <ComponentName>})` but this seems to not work sometimes. It may be a much better practice to just put a `.v-<component>-test` class on the `Vuetify component` for matching

After trying it out this is a **much** better approach

Test for CI/CD
