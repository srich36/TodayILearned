# Client Side OAuth Flow

The `oauth` process is as follows:

1. The client makes a request to the oauth server and the user authorizes permissions.
2. Upon authorization, the oauth server (e.g. Facebook, Google), redirects to a specified url with a `code` as a query param. I believe you can do this on the frontend with `postmessage` as the redirect url.
3. The client then exchanges the `code` with the Oauth server for an `access token`.
4. This access token can then be used to pass to an application backend like `django-rest-framework-social-auth2` for authentication/user creation

Steps 2 and 3 may be blurred together.

# JWTs (Json Web Tokens)

- JWTs are just JSON payloads encoded as a token
- When decoded you can access the application-specific fiels in the payload, e.g. user ID, time issued at, etc.
