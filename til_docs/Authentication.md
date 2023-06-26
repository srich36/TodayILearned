# OAuth Flow

Note that the traditional Oauth flow is used for Authorization of data across applications, not Authentication of users. OpenID Connect is a layer on top of OAuth that allows for authentication of users.

The `oauth` process is as follows:

1. The client makes a request to the oauth server and the user authorizes permissions.
2. Upon authorization, the oauth server (e.g. Facebook, Google), redirects to a specified url with a `code` as a query param. I believe you can do this on the frontend with `postmessage` as the redirect url.
3. The client then exchanges the `code` with the Oauth server for an `access token`.
4. This access token can then be used to pass to an application backend like `django-rest-framework-social-auth2` for authentication/user creation

Steps 2 and 3 may be blurred together (in the implicit flow), but if possible it's better to keep these separate
- The client is a front-channel and thus not secure, and since the code is in the url we don't want that being the actual access token
- We want the actual access token to be passed through a back-channel, e.g. a `POST` request to the backend
  - So normally, the browser will make a POST request to the client app backend, and the client app backend will make the access token exchange request with a secret configured for the oauth server 
  (a client app has to set up with google's authorization server to get a secret)

- OAuth has separate `grant_type`s the specify how to retrieve an access token
  - `authorization_code` is the most common, but there is also `client_credentials` and `refresh_token`
    - `client_credentials` is for machine-to-machine communication because it authenticates based on the oauth client secret and client id when there is no user
  - There is also a framework for creating your own `grant_type` if you run an authorization server, which allows you to implement custom ways clients can retrieve access tokens
- Clients can request a set of `scopes` (in the initial authorization server request), which restrict permissions that the client can access (e.g. repo.read)
  - These list of scopes are then used to generate a consent screen for the user to approve and log in at the authorization server (e.g. accounts.google.com)
- In all of the above steps, the server forces the browser to redirect by sending a 302 Found HTTP status code along with a Location header containing the URL to redirect to. This is handled automatically by the browser.

# OpenID Connect (OIDC)

- These are the "log in with Google" buttons (social authentication)
- In the original OAuth protocol, there is no standard way to get the identity of the user (e.g. email, name, etc.)
  - When google, facebook, twitter started implementing these login buttons, they all had to add their own hacks
- OIDC adds
  - An ID token (this contains information about the user - this is a JWT)
  - A `UserInfo` endpoint for getting more user information
- Basically what this means is that when talking to an authorization server that understands OIDC you can ask for an ID token in addition to an access token
  - This is done by adding `openid` to the list of scopes
  - **Everything else is the same as the OAuth flow**
- 

# Single-Sign On (SSO)

- This uses OIDC under the hood
- A user logs into one system and is automatically logged into other systems
  - Prominent in enterprise IT
- Identity federation deals with managing user identities and giving them the rights to log in to these other apps
- **This requires a centralized authentication server that all the other apps trust**
  - This is called the Identity Provider (IdP)
  - The IdP is responsible for authenticating the user and issuing an ID token
  - The IdP is also responsible for managing the user's identity and permissions
- There are two main flows for SSO:
  - 1. Service Provider initiated (SP-initiated) - e.g. logging into an app via sso from the app's login page
  - 2. Identity Provider initiated (IdP-initiated) - e.g. logging into an app from the Okta homepage
- SSO enabled applications have to be configured to support both flows

## Service Provider Initiated (SP-initiated)    

- The flow is generally as follows:
  - User navigates to example1.com
  - example1.com redirects to the IdP
  - The IdP authenticates the user and redirects back to example1.com with an ID token
  - User navigates to example2.com
  - example2.com redirects to the IdP
  - The IdP sees that the user is already authenticated and redirects back to example2.com with an ID token
- IdPs can store the permissions for each user for each app - it's a centralized place for permission management

## Identity Provider Initiated (IdP-initiated)

- The flow is generally as follows:
  - Prior to this flow, the specific app must be configured to support SSO
  - User navigates to the IdP homepage and clicks an app
  - The IdP sends a request to the app with an SSO assertion that the user is logged in (either SAML or an OIDC id token)
  - The application verifies the assertion and grants access


## SSO Protocols

- There are multiple protocols for implementing SSO. SASS vendors may need to support multiple protocols to support different customers.
- SAML, OIDC, and WS-Federation are the most common
- When someone logs in with Google using OIDC, Google is the IdP and the app is the Service Provider (SP)

### SAML

- Exchanges data in XML
  - The three components are the user, identity provider, and service provider
  - (using DataDog as an example) 
    - Datadog is the service provider
    - Datadog will check with the IdP to see if the user can access the resource and the IdP returns an assertion with user data
- Authentication is not defined in the protocol, so you can have users authenticate against your database if desired


- Choosing an identity provider
  - Building locally - in house
  - Using social providers (Google, Facebook)
  - Using a SaaS provider (Okta, Auth0)
- Companies like Auth0 can also make integrating with identity providers if you are building a SaaS product a lot easier
- When implementing different logins as a SaaS product, it's common to have multiple "authentication backends" that support different
types of authentication and return a standardized user object
  - This is then used to generate a JWT for the user which is stored client-side regardless of authentication mechanism
  - When doing this, your app is the Service Provider (SP) and the authentication backend is the Identity Provider (IdP). Your app will connect to multiple different IdPs
- You can also implement single logout in SSO
- **SSO can work because the IdP drops a session cookie in the browser**
  - Since the IdP sets this cookie it can see it when a user is logging in to app A and app B
  - **This is why in both cases app A and app B have to redirect to the IdP to log in, because only the IdP can see the cookie**

# JWTs (Json Web Tokens)

- JWTs are just JSON payloads encoded as a token
- When decoded you can access the application-specific fiels in the payload, e.g. user ID, time issued at, etc.
- JWTs are split up into 3 parts
  - Header
  - Payload
  - Signature
- JWS (Json Web Signature) is standard for signing JWTs
  - The signature is used to verify that the JWT was issued by the correct party
  - There are two signature types
    - Symmetric (HMAC algorithms) which uses the same key to sign and verify the JWT. This is especially useful in authentication, because if an backend is responsible for signing and verifying the key
    on subsequent requests, it can make sense to use the same key
    - Asymmetric (RSA algorithms) which uses a public/private key pair to sign and verify the JWT. The JWT is signed with the private key and verified with the public. This is useful for verifying signatures between two parties.
    RSA signatures are often more secure than HMAC signatures (because the signing key can be kept private), but they are also slower to compute.

# Passwordless Auth

- In this flow, a user enters an email or a phone number and a OTP is sent to that user that they then enter to log in


# Authenticator Apps

- These generate Time-based One Time Passwords (TOTP) which are codes generated by the current time and a shared secret between the authenticator app and the service you are logging into
  - [Algorithm](https://datatracker.ietf.org/doc/html/rfc6238)
- Every 30 seconds, the authenticator app generates a new code based on the current time and the shared secret
- Upon login, the service you are logging into will use the same algorithm to generate a new code and compare it to the code you entered