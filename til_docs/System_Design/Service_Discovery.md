# Service Discovery

- As individual instances of servers/services spin up and down clients must know how to locate these services to send requests
- Generally what happens is they first query a service registry to get updates servcie information
- Services register themselves with the registry as they spin up and down
    - Amazon ALB acts as the service registry and forwards requests to the individual instances
- I think you need to have a set of well known DNS names for your individual services in your DNS and then have these
refer to load balancer hostnames, and have the load balancer take care of the discovery


