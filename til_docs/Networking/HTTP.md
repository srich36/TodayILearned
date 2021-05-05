# Overview

- *HyperText transfer protocol

## 1.0

- `HTTP 1.0` had to open a connection to the server, send a request, receive a response, and close it. It could not reuse connections for multiple requests

## 1.1

- `HTTP 1.1` patched this with the keepalive, which allows for reusing of connections for requests
- However, there were no identifiers in requests so the only way to know which response corresponds
to what request is to receive the response in order
  - e.g. Request 1,2,3 -> Response 1,2,3 -> the responses *must* come back in this order
  - This leads to *head of line blocking* where if response 1 takes a long time to compute response
  2 and 3 can't yet be returned
- Max of 6 open connections per origin

## 2

- `HTTP 2` gives each request a unique identifier. Thus, data for any request can come back in any order (since it can be reffered to by its identifier)
solving *head of line blocking*
- `HTTP 2` allows for bi-directional data streams
- Converts all messages and encodes them into binary (as opposed to plain text in HTTP/1.1)
  - Plain text data is just binary that is not compressed (the compressed data is gzipped for example)
- Messages are split up into small pieces called *frames* and can be mixed and matched
- Since there are only needs to be one bi-directional multiplexed stream, HTTP 2 only needs one connection
- Allows for *server push* where the server pushes resources it knows the client will need without the client asking for it (e.g. links in a web page before the client parses and requests them)

## 3

- `HTTP/3` is currently in draft status but is used by many major cloud providers
- Works over `UDP`
- The sucessor to `QUIC`
- TCP connections stop until a lost data packet is retrieved -> blocking the stream
  - This is head of line blocking but for HTTP 2 (all streams stop when a packet is lost on the stream)
- **Automatically** uses TLS 1.3
- Downloads aren't bound to IP addresses but rather connection identifiers to allow you to switch connections mid download and still work
