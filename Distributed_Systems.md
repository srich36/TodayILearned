# Networking Architecture

### Reverse Proxy

A `reverse proxy` is a proxy that sits in front of the backend/web server and receives incoming requests and then processes those requests routing them to the correct server. In this way you can configure something like `nginx` to be a load balancer as it receives incoming requests and load balances them to different server instances.

### Forward Proxy

For a `forward proxy` client requests immediately go through a proxy server which then routes those requests to the domain specified in the request. This domain then may point to a `reverse proxy` which routes the requests to different microservices in the application.

### Microservice Architecture

A collection of instances, db, cache, application server, that are isolated (mostly in Docker containers) and can communicate with each other on the network. If you have a microservice application server for example, you can load balance incoming requests (e.g. through an `nginx` configuration) to the different application server instances on the network. This allows you to `horizontally scale` your application as you can easily spin up new instances of whatever layer, application server, db, etc. that needs more computing power.

### Sidecar Paradigm (ngnix)

Sidecars are a way of structuring application architectures so that for individual microservices to talk to one another they have to go through a proxy (called a sidecar). This allows you to take all the ssl and policy management out of the application themselves, and instead have something like `nginx` working as a `reverse proxy` applying access policies between services. For more information see the Software Engineering Daily podcast on sidecars.
