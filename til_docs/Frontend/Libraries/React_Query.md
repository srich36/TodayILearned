# Overview

- `useQuery` -> to read data (GET)
- `useMutation` -> to modify data (POST, DELETE, etc.)
- It handles, cachine, deduping, updating out of date data in the background, performance optimizations, etc.
- To invalidate queries
  - `queryClient.invalidateQueries` 
  - This is useful if you make a post request and what to refresh the get request objects
- React-query comes with devtools that you can use
- Uses a discriminated union type in the query result to make sure `data` is defined if you check `isSuccess`
  - e.g. `const { data, isSuccess } = useQuery`