# Material-ui

- To use spacing utilities you wrap components in a `Box` component
  - Only fully in `v4`
- Designed on the font `Roboto`
  - Must include this yourself
- Colors can be imported and modified with `blue[500]` for example
- You can configure the theme through `createMuiTheme`
- Icon names are in PascalCase
  - Should use default exports if you don't have tree-shaking configured (though webpack in production should do this for you)

## Component Details

- `Typography`: A container component that you can put sub-components inside. This is used to set the font characteristics of the children
- `Hidden`: A component that allows you to hide components based on breakpoints
- `Popover` and `Popper`: Open popup menus
- `ClickAwayListener`: Listen to click events _not_ on the component

#### Transitions

Material UI provides transition components that you wrap around the components you want to apply the transition to

- `Fade`
- `Collapse`
- `Grow`
- `Slide`
- `Zoom`

## Layout

- `<Grid>`: Responsive UI is based on a 12 column grid layout
  - Has `xs`, `sm`, `md`, `lg`, and `xl` breakpoints
  - Spacing is automatically taken into account when setting the number of columns
  - Can define multiple widths on a `<Grid item>` for resizing at different breakpoints
  - Built on Flexbox
  - Split into two types: `container` and `item` but you can have both, e.g. `<Grid container item>` for it to be a flex container and flex item

#### Breakpoints

##### Values

- `xs`: 0-599px
- `sm`: 600-959px
- `md`: 960-1279px
- `lg`: 1280-1919px
- `xl`: 1920px or larger

##### API

- `useMediaQuery`: CSS media Query hook for React

## Styling

- Inline styling vs classes:
  - Only use inline style for dynamic styling
  - Classes are much faster, have auto-prefixing, media queries, better debugging, keyframes, etc.
- `withStyles`, `withTheme`, are HOC's for styling
- CSS in JS is the current standard
  - 3 different APIs for this:
    - Hook API (`makeStyles`)
    - Styled Components API
    - Higher order component (HOC) API (`withStyles`)
- To modify/obfuscate class names in production you can use a class name generator
- `ThemeProvider` takes a theme property and makes the theme available down the React tree
- `useTheme()`: A hook to return the theme of the stylesheet in a functional component
- `withStyles()`: Link a stylesheet with a component using HOCs
- `withTheme()(Component): Class-based API for providing the theme to a component as a prop

#### Classes

- Can use with withStyles and className
- Class names follow the pattern `Mui[<component_name>]-[<style_rule_name>]-UUID`
- Can use the `classnames` library to apply multiple class names to an element or just use string interpolation
- All components accept a `classes` property for customization
  - I need to read more about this

## Interesting/Appealing Components (For Potential Design Use)

- `Breadcrumbs` with icons
- `ToggleButton`
- `Avatar`
- `Badges`
- `Tabs` for navbar navigation
- `IconButtons`
- `Button` with `component={Link}`
- `Chips`
- `Dialog`
  -  A modal like components that interrupts the user and prompts them to make a decision
- `Divider`
- `Drawer` for a side nav
- `ExpansionPanel` for an accordian like expansion effect
- `Menu` For profile, login/logout account avatar
- `Paper`
  - A flat, opaque component representing paper
- `Progress`
- `FormGroup`
- `Switch`
- `Snackbar`
- `Steppers`
- `Tables` and `TablePagination`
- `TextField`
  - Wraps `Label`, `Input`, and `HelpText` components to make it easier to display a nice field
- `Input` with adornments (prepended and appended text/icons)
  - Can pass the adornments in to `TextField` as well
- `Tooltip`
  - Must pass props down to child elements if it is a custom react component
  - Otherwise, it will handle the hovering and subsequent activation for you

## Customization

- Inject theme with `MuiThemeProvider`
- The overrides object in `createMuiTheme` allows you to override every instance of a material-ui component
- You can also apply properties on all instances of a given component with the `props` keyword in `crateMuiTheme`

## Testing
- `createShallow()`: Shallow render a component
- `createMount()`: Fully mount the component on the DOM
- `createRender()`: Render component to string

## General Tips

- In general, material-ui is a library implementing Google's material design
- You can code split by moving CSS and JS into different files
- Property spread: Properties flow down from Mui components to their children.

e.g.
```HTML
<MenuItem disableRipple>
```

`disableRipple` will flow from `MenuItem` -> `ListItem` -> `ButtonBase` thus disabling the ripple at `ButtonBase`
- The `component` property of material-ui components allows you to change what the root node renders as. This is how you can integrate with something like `react-router`
  - `component` as a prop should always be passed statically, not with an arrow function directly in the prop, otherwise a new component will have to be created and rendered on every re-render, regardless of whether it changes

