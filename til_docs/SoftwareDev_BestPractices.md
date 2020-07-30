# General

- Semantic versioning:
  - e.g. `16.5.2`
    - The `16` refers to the major version
    - The `5` gets updated on a feature release
    - The `2` gets incremented on a bug fix

- When overriding a base class it is often best to stub out methods that need to be overriden on the base class and have them raise a `NotImplemented` error or something similar