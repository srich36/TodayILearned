# Building Packages

- A source distribution `sdist` is a build of a Python package that includes all the source code, and any relevant
C/C++ exenstions
  - This is shipped in a `tar.gz` file
  - Includes `.py` files, `C++`, `C` files for binary modules which can then be used to recompile on any platform
  - When pip retrieves a source distrubtion, it first creates a wheel from it, then installs it
- `bdist_*` means built distribution
  - This includes `.pyc` files, `.so`, `.dll`, etc. and *no* `setup.py`
  - This package is specific to a platform (e.g. linux x86) and to the version of Python
  - From this archive you can just extract it into the relavant parts of your filesystem (e.g. packages) and it will
  will
- Built distributions are much faster than source distributions because the install doesn't need to go through 
`setup.py`

Note:

- `.pyc` files are python files compiled to bytecode. After importing a module, Python will often build these .pyc
files to make importing the module much faster the next tie

## Wheels

- A wheel is a standard `PEP` format, egg is not
- `Wheels` do not include `.pyc` files
  - Thus, when a wheel only contains `.py` files it can be "universal" and work on any platform
- Eggs are the older version of wheels
- To build a universal wheel (Python 2 *and* Python 3 compatible) you pass the universal flag to setup.py
  - e.g. `python setup.py bdist_wheel --universal`
  - This is a **Pure Python wheel**
- Non-universal wheels (the default) support one major version of Python
  - 1. If the code is pure Python (e.g. no compiled extensions - `.pyc` files), it will build a package compatible
  with the major Python version (e.g. Python 2 or 3)
    - `python setup.py bdist_wheel`
- Platform wheels only support one platform (e.g. Linux)
  - These will be automatically created if there are `.pyc` files
    - `setup.py` automatically determines when to build a platform wheel when running `python setup.by bdist_wheel`
- To install a wheel file you can just do `pip install <file>.whl`

### Naming Convention

e.g. `mypackage-0.0.1-py3-none-any.whl`

- Automatically created by the build process
- Broken down as follows:
  - <package_name>-<version>-<python-version-wheel-supports>-<ABI_tag>-<platform>
  - So the above would translate as mypackage, version 0.0.1, for Python 3, no ABI requirements, any platform

