# React Router

- Generally you wrap the top-level component of your app with `<Router>`
- Anywhere in your app you can then have a

```HTML
<Switch>
    <Route path="/path">
        <ComponentToRenderIfPathIsMatched />
    </Router>
</Switch>
```

to match a path and render a compoonent

- While there is a way to have a route configuration like in `vue-router` you generally do conditional rendering with `Switch` and nested `Switch` statements

- To nest switches you put them in other components but still have to use the full path (e.g. `/accounts/add`)
- You route programmtically with a `<Redirect/>` component
- You can also use history.push('/')

### Programmatic Navigation


- You can route programmtically in a declaritive style with a `<Redirect/>` component
- You can also use `history.push('<path>')` where `history` is a library that `react-router` depends on  
    - To use this, when initializing your Router, you must wrap it in a `<Router history={history}>`
    - For some reason this does not work with `browserRouter`, only `Router` and I'm not sure why