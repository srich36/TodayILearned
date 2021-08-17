# General

- Rule of thumb -> can rewrite in 2 weeks?
- Services expose APIs that other services can communicate with
- **Golden rule** - can make a change to a service and deploy it without changing anything else
- Each service has its own database
- A few hundred lines long for an individual microservice?
- Microservices are a specific approach to service oriented architectures (SOA)
- Should have **one** method of communicating between services (e.g. gRPC, REST, protobuf, etc.)
- It's important to be able to have a coherent, cross-service view of system health
  - Services should emit health and general monitoring related metrics in the same way (e.g. `/health` endpoint)
- Provide service templates for consistency
- Start by identifying coarse-grained bounded contexts
  - Domains that can exist by themselves
  - Next, subdivide along these concepts
  - A standard CRUD microservice is not what we want


## Making a Good Microservice

- Microservices should have **loose coupling** and **high cohesion**
    - **loose coupling**: Changes to one service should not require changes to another
      - Chatty communication between services can lead to tight coupling
    - **high cohesion**: Related behavior should sit together and unrelated behavior should sit elsewhere
      - If we want to change behavior we should only have to change it in one place


## Pitfalls

- Shared code to communicate between services can become a point of coupling
