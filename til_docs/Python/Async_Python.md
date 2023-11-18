# Overview

- Async Python code can be non-blocking for things like network requests
- AsyncIO only uses one thread with an event loop
- This document only outlines modern Python async code
  - Modern async python code is a lot like JavaScript
- FastAPI is built on `AnyIO` which supports the `asyncio` standard library

### Coroutines

- These behave like generators and can be defined with `async def`
  - You can `await` other coroutines inside of a coroutine (async function)
- Using the `yield` keyword in a coroutine will make this an async generator
- A coroutine is returned by an `async` function
  - You can await this coroutine to get the return value of the function
  - **These are comparable to goroutines**
- `asyncio.queue` allows two coroutines to share data
  - This is intended for coroutines to use that are running in the same event loop (thread)

### AsyncIO

- `asyncio.run` starts the event loop and will schedule the coroutine provided
  - This is the main entrypoint for async programs
- `asyncio.wait` can be used to wait for multiple coroutines to finish
  - This can return pending and completed coroutines, and you can configure when to return (e.g. all complete, first coroutine completed, etc.)
- `asyncio.Event` can be used as a signal between coroutines that some event happened
  - This is similar to a `threading.Event` and is essentially a boolean flag

#### Tasks

- A task is a single unit of work that can be scheduled in the event loop
- Tasks can be created with `asyncio.create_task`
  - Tasks are wrappers around coroutines and you can use these to schedule coroutines to run concurrently
  - **This scheduled the coroutine to run in the next iteration of the event loop -- even before awaiting**
    - This is why tasks are useful
  - You can await tasks
- `ayncio.ensure_future` was an older way of creating tasks
  - Now, you should use `asyncio.create_task` if you have a coroutine and only use `asyncio.ensure_future` if you have an arbitrary future

### Generators

- Allow you to define functions that behave as iterators which can be entered or exited at any time
- Async generators are just a coroutine that uses `yield` instead of `return`
  - To loop over an async generator you must use `async for`
  - Each iteration of the loop returns an `awaitable` object that must be awaited

### FastAPI

- To stream server-side events, you need an async iterable

- **The challenge** -- Return an async iterable to FastAPI top-level
  - 1. Make the `get_chat_response` function an async generator that yields streamed tokens for each LLM call (probably best)
  - 2. Figure out a way with async callbacks
     - I don't like this approach because now we are coupling an async event to the langchain callbacks
     - This won't scale well when we want to fire events for tools/function calls, etc.
  - Probably the way to do this is to call astream and manually build up the messages with +=
    - This seems to be the only way to go non-blocking all the way up the stack
      - The get singular chat response can't block and return a final value or the 