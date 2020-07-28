# Flux

Flux is a pattern consisting of a singleton dispatcher that emits events (actions) with a `type` and `payload` , triggering callback functions in all stores. The stores then `switch` on the action type and decide if they should respond to the emitted action

Data flow is generally as follows:

1. Component calls action creator function
2. The action creator may make an API call and await the response
3. The action creator then dispatches an event through the `Dispatcher' singleton
4. When stores are registered to the `Dispatcher` in their constructor, they register a callback function to execute on every emitted action. Thus, each store will execute its callback
5. If the store is responsible for the action `type` (as determined by the `switch` statement) it updates its data
6. A higher order component (HOC) is used to inject store state as props into connected components. Thus, whenever the store state changes so do the props of connected components, thus causing them to re-render

In general, the `Dispatcher` is simply a registry for callbacks
