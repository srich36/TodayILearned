# General

- `navigator.sendBeacon` -> is used to send analytics before the page is closed (in an `beforeunload`)
  - This keeps the request alive even if the page is closed (therefore the data can still be sent)
  - This is the same with the `fetch` keepalive option (it uses fetch under the hood)