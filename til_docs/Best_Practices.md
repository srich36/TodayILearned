# General

- Semantic versioning:
  - e.g. `16.5.2`
    - The `16` refers to the major version
    - The `5` gets updated on a feature release
    - The `2` gets incremented on a bug fix

- When overriding a base class it is often best to stub out methods that need to be overriden on the base class 
and have them raise a `NotImplemented` error or something similar

## Web Dev

- Put URL params in as part of the URL `plans/2` instead of `plans?id=2`
  - When the `id` is part of the url and not a query param, you have two separate, cleaner endpoints (e.g. `/plans` and `/plans/<int>`) instead of coupling them and having to handle both cases at `/plans` 
  - While this is a matter of preference, I think it is cleaner