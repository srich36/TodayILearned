# Fonts

## Terminology

- *serif*: extending features at the end of a font stroke

## Font Faces

- CSS has "@ rules" that allow you to tell css how to do something. 
  - One of these rules is `@font-face` which tells CSS how to import a font from a URL or local file
  - You give the font a `font-family` (the name to call the font, you need one of these for each different weight type),
  and a `font-weight` (the reference weight for this instance of the font-family)
  - If, in your CSS you then specify `font-family` it will pick one of the fonts loaded with `@font-face` and use the 
  one with the closest `font-weight` as specified in `@font-face`

## Font Types

- *Monospace*: Each character takes up the same amount of width
- *sans-serif*: A font without serifs. When used in css this just means a general serif font
- *serif*: A font with serifs
