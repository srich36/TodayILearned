# CORS (Cross Origin Resource Sharing)

- CORS is a **browser** policy where the browser will automatically fail HTTP requests to another origin if the server does not respond with an `Access-Control-Allow-Origin` header that includes the browser page's origin
- The browser first sends a *preflight* request to check if the server responds with the CORS header to allow the request to succeed
- **CORS is for server security**
  - It ensures malicious websites cannot send requests to your backend through the browser
    - This is **really** important for browsers since they store session cookies that will be sent along in the request if the request is sent to a specific website that the cookie originated from 
    - This is why CORS is a browser thing and not just a general API thing
    - Cookies set with `Set-Cookie` for one server are sent in every subsequent API request to that server