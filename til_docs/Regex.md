## Matchers

- [a-z] a letter between a and z
  - Ranges must be within brackets
- [a-df] match a letter between a-d or f
- Capture groups `()` embed any part of the string within `()` to make it a capture group
- `\1` refers to the first capture group. `\<n>` refers to the nth capture group
- `a{2}` matches a twice
- `\w` any "word" character (alphanumeric)
- `\s` any space character

## Modifiers

- `a{2,4}` matches a between 2 and 4 times
  - `a{2,}` matches a between 2 and unlimited times

## Quantifiers

## Escape Character

- To escape a character use a `\`
- `\-` matches a single `-` 
  - (need the escape because `-` is used in ranges)
  - But when not used in a range you don't need to escape